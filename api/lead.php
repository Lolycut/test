<?php
/**
 * Обработчик заявок сайта «ИЗЮМ» (ООО «АЛБРО») для hoster.by (тариф «Лайт») и K-9 Mail.
 * Проверяет чекбокс согласия по Закону РБ № 99-З и отправляет структурированное письмо на доменную почту.
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method Not Allowed'], JSON_UNESCAPED_UNICODE);
    exit;
}

$config = require __DIR__ . '/config.php';

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    $data = $_POST;
}

// 1. Антиспам (Honeypot)
if (!empty($data['website_hp'])) {
    echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
    exit;
}

// 2. Проверка согласия на обработку персональных данных (ст. 5 Закона РБ № 99-З)
$consent = !empty($data['consentLaw99Z']) || !empty($data['agree']);
if (!$consent) {
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'error' => 'Необходимо подтвердить ознакомление с Политикой обработки персональных данных (Закон РБ № 99-З).'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 3. Валидация белорусского телефона (+375 XX XXX-XX-XX)
$phoneRaw = isset($data['phone']) ? preg_replace('/\D+/', '', (string)$data['phone']) : '';
if (strpos($phoneRaw, '80') === 0 && strlen($phoneRaw) === 11) {
    $phoneRaw = '375' . substr($phoneRaw, 2);
}
if (!preg_match('/^375(17|25|29|33|44)\d{7}$/', $phoneRaw)) {
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'error' => 'Укажите корректный белорусский номер в формате +375 (XX) XXX-XX-XX.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$phoneClean = '+' . $phoneRaw;
$phonePretty = sprintf(
    '+375 (%s) %s-%s-%s',
    substr($phoneRaw, 3, 2),
    substr($phoneRaw, 5, 3),
    substr($phoneRaw, 8, 2),
    substr($phoneRaw, 10, 2)
);

// 4. Защита от частых запросов (Rate limit по IP)
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$storageDir = __DIR__ . '/storage';
if (!is_dir($storageDir)) {
    @mkdir($storageDir, 0750, true);
}
$rateFile = $storageDir . '/rate_' . md5($ip) . '.tmp';
$now = time();
if (is_file($rateFile)) {
    $last = (int)@file_get_contents($rateFile);
    if ($now - $last < (int)($config['rate_limit_sec'] ?? 20)) {
        http_response_code(429);
        echo json_encode([
            'ok' => false,
            'error' => 'Заявка уже отправлена. Пожалуйста, подождите несколько секунд.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}
@file_put_contents($rateFile, (string)$now);

// 5. Подготовка полей заявки
$cleanStr = function ($v, $max = 500) {
    $s = trim(strip_tags((string)$v));
    $s = preg_replace('/[\r\n]+/', ' ', $s);
    return mb_substr($s, 0, $max, 'UTF-8');
};

$name    = $cleanStr($data['name'] ?? '', 100) ?: 'Не указано';
$comment = $cleanStr($data['comment'] ?? '', 1000) ?: '—';
$model   = $cleanStr($data['model'] ?? '', 200);
$page    = $cleanStr($data['page'] ?? '', 120) ?: '/';
$cfgSummary = '';
if (!empty($data['config']) && is_array($data['config']) && !empty($data['config']['summary'])) {
    $cfgSummary = $cleanStr($data['config']['summary'], 600);
}

date_default_timezone_set('Europe/Minsk');
$dateMinsk = date('d.m.Y H:i:s');
$leadId = date('Ymd-His') . '-' . substr(md5($phoneClean . microtime(true)), 0, 4);

// 6. Резервное сохранение в локальный CSV внутри защищённой папки на hoster.by
if (!empty($config['save_csv'])) {
    $csvFile = $storageDir . '/leads.csv';
    $isNew = !is_file($csvFile);
    if ($fp = @fopen($csvFile, 'a')) {
        if ($isNew) {
            fwrite($fp, "\xEF\xBB\xBF"); // UTF-8 BOM
            fputcsv($fp, ['ID', 'Дата (Минск)', 'Имя', 'Телефон', 'Модель/Конфигурация', 'Комментарий', 'Страница', 'Согласие 99-З'], ';');
        }
        fputcsv($fp, [
            $leadId,
            $dateMinsk,
            $name,
            $phonePretty,
            $cfgSummary ?: ($model ?: '—'),
            $comment,
            $page,
            'Да (ознакомлен с Политикой ООО АЛБРО)'
        ], ';');
        fclose($fp);
    }
}

// 7. Формирование письма для K-9 Mail (Multipart: Plain Text + HTML с кликабельным номером)
$subjectTitle = $model ? "Заявка: {$model} — {$phonePretty}" : ($cfgSummary ? "Конструктор — {$phonePretty}" : "Заявка с сайта ИЗЮМ — {$phonePretty}");
$subjectEncoded = '=?UTF-8?B?' . base64_encode($subjectTitle) . '?=';

$textBody = "НОВАЯ ЗАЯВКА С САЙТА ИЗЮМ (izum-home.by)
"
    . "========================================
"
    . "Номер заявки: {$leadId}
"
    . "Дата и время: {$dateMinsk} (Минск)
"
    . "Имя клиента:  {$name}
"
    . "Телефон:      {$phonePretty} ({$phoneClean})
"
    . ($model ? "Модель:       {$model}
" : "")
    . ($cfgSummary ? "Конструктор:  {$cfgSummary}
" : "")
    . "Комментарий:  {$comment}
"
    . "Страница:     {$page}
"
    . "Закон № 99-З: Пользователь подтвердил ознакомление с Политикой обработки ПД ООО «АЛБРО»
";

$htmlName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$htmlComment = htmlspecialchars($comment, ENT_QUOTES, 'UTF-8');
$htmlModel = htmlspecialchars($model ?: ($cfgSummary ?: 'Общая консультация'), ENT_QUOTES, 'UTF-8');
$htmlPage = htmlspecialchars($page, ENT_QUOTES, 'UTF-8');

$htmlBody = "<!doctype html><html lang='ru'><body style='font-family:Arial,sans-serif;background:#F5F2EE;padding:16px;color:#2A231D'>"
    . "<div style='max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:14px;overflow:hidden;border:1px solid #E2DBD2'>"
    . "<div style='background:#095562;color:#FFFFFF;padding:18px 22px'>"
    . "<div style='font-size:12px;letter-spacing:1px;opacity:.85'>МАГАЗИН МЯГКОЙ МЕБЕЛИ «ИЗЮМ» · ООО «АЛБРО»</div>"
    . "<h2 style='margin:6px 0 0;font-size:20px'>Новая заявка № {$leadId}</h2>"
    . "</div>"
    . "<div style='padding:20px 22px'>"
    . "<p style='margin:0 0 16px'><a href='tel:{$phoneClean}' style='display:inline-block;background:#095562;color:#FFFFFF;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:bold;font-size:16px'>Позвонить: {$phonePretty}</a></p>"
    . "<table style='width:100%;border-collapse:collapse;font-size:15px'>"
    . "<tr><td style='padding:8px 0;border-bottom:1px solid #EFEBE6;color:#6A6058;width:130px'>Имя:</td><td style='padding:8px 0;border-bottom:1px solid #EFEBE6'><strong>{$htmlName}</strong></td></tr>"
    . "<tr><td style='padding:8px 0;border-bottom:1px solid #EFEBE6;color:#6A6058'>Телефон:</td><td style='padding:8px 0;border-bottom:1px solid #EFEBE6'><a href='tel:{$phoneClean}' style='color:#095562;font-weight:bold'>{$phonePretty}</a></td></tr>"
    . "<tr><td style='padding:8px 0;border-bottom:1px solid #EFEBE6;color:#6A6058'>Модель / Расчёт:</td><td style='padding:8px 0;border-bottom:1px solid #EFEBE6'>{$htmlModel}</td></tr>"
    . "<tr><td style='padding:8px 0;border-bottom:1px solid #EFEBE6;color:#6A6058'>Комментарий:</td><td style='padding:8px 0;border-bottom:1px solid #EFEBE6'>{$htmlComment}</td></tr>"
    . "<tr><td style='padding:8px 0;border-bottom:1px solid #EFEBE6;color:#6A6058'>Время (Минск):</td><td style='padding:8px 0;border-bottom:1px solid #EFEBE6'>{$dateMinsk} (страница {$htmlPage})</td></tr>"
    . "<tr><td style='padding:8px 0;color:#6A6058'>Закон № 99-З:</td><td style='padding:8px 0;color:#2F7D5B'>✓ Чекбокс ознакомления с Политикой ПД отмечен</td></tr>"
    . "</table>"
    . "</div></div></body></html>";

$boundary = '=_IzyumPart_' . md5((string)microtime(true));
$fromEmail = $config['mail_from'] ?? 'noreply@izum-home.by';
$fromName  = '=?UTF-8?B?' . base64_encode($config['mail_from_name'] ?? 'ИЗЮМ Сайт') . '?=';
$toEmail   = $config['mail_to'] ?? 'info@izum-home.by';

$headers = [
    "From: {$fromName} <{$fromEmail}>",
    "Reply-To: {$fromEmail}",
    "MIME-Version: 1.0",
    "Content-Type: multipart/alternative; boundary="{$boundary}"",
    "X-Priority: 1 (Highest)",
    "X-Mailer: IZYUM-HosterBy-Mailer/1.0"
];
if (!empty($config['mail_cc'])) {
    $headers[] = "Cc: " . $config['mail_cc'];
}

$mimeBody = "--{$boundary}
"
    . "Content-Type: text/plain; charset=UTF-8
"
    . "Content-Transfer-Encoding: base64

"
    . chunk_split(base64_encode($textBody)) . "
"
    . "--{$boundary}
"
    . "Content-Type: text/html; charset=UTF-8
"
    . "Content-Transfer-Encoding: base64

"
    . chunk_split(base64_encode($htmlBody)) . "
"
    . "--{$boundary}--
";

$sent = false;
if (($config['transport'] ?? 'mail') === 'smtp') {
    // Прямая отправка через SMTP SSL (порт 465 на hoster.by)
    $sent = sendViaSmtp($config, $fromEmail, $toEmail, $subjectEncoded, $headers, $mimeBody);
} else {
    // Штатная отправка через локальный Exim на виртуальном хостинге hoster.by
    $sent = @mail($toEmail, $subjectEncoded, $mimeBody, implode("
", $headers), "-f{$fromEmail}");
}

echo json_encode([
    'ok'     => true,
    'leadId' => $leadId,
    'mailed' => (bool)$sent
], JSON_UNESCAPED_UNICODE);

/**
 * Компактный SMTP-клиент для защищённого соединения с почтовым сервером hoster.by (порт 465 SSL)
 */
function sendViaSmtp(array $cfg, string $from, string $to, string $subject, array $headers, string $body): bool {
    $fp = @stream_socket_client($cfg['smtp_host'] . ':' . $cfg['smtp_port'], $errno, $errstr, 10);
    if (!$fp) return false;
    $read = function () use ($fp) {
        $out = '';
        while ($line = fgets($fp, 515)) {
            $out .= $line;
            if (isset($line[3]) && $line[3] === ' ') break;
        }
        return $out;
    };
    $cmd = function (string $c) use ($fp, $read) {
        fwrite($fp, $c . "
");
        return $read();
    };
    $read();
    $cmd('EHLO izum-home.by');
    $cmd('AUTH LOGIN');
    $cmd(base64_encode($cfg['smtp_user']));
    $authRes = $cmd(base64_encode($cfg['smtp_pass']));
    if (strpos($authRes, '235') === false) { fclose($fp); return false; }
    $cmd("MAIL FROM:<{$from}>");
    $cmd("RCPT TO:<{$to}>");
    $cmd('DATA');
    $fullMsg = "To: <{$to}>
Subject: {$subject}
" . implode("
", $headers) . "

" . $body . "
.";
    $dataRes = $cmd($fullMsg);
    $cmd('QUIT');
    fclose($fp);
    return strpos($dataRes, '250') !== false;
}
