<?php
// Incluir las clases de PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Ruta a las clases de PHPMailer
require 'vendor/autoload.php';

// Función para manejar errores
function returnError($message) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => $message]);
    exit;
}

// Verificar si se recibió una solicitud POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    returnError('Método no permitido');
}

// Verificar si se recibieron los datos necesarios
if (!isset($_POST['customerName']) || !isset($_POST['customerEmail']) || !isset($_POST['companyEmail'])) {
    returnError('Faltan datos requeridos');
}

// Verificar si se recibió el archivo PDF
if (!isset($_FILES['pdfFile']) || $_FILES['pdfFile']['error'] !== UPLOAD_ERR_OK) {
    returnError('No se recibió el archivo de cotización correctamente');
}

// Obtener los datos del formulario
$customerName = $_POST['customerName'];
$customerEmail = $_POST['customerEmail'];
$customerAddress = $_POST['customerAddress'] ?? 'No especificada';
$lat = $_POST['lat'] ?? '';
$lng = $_POST['lng'] ?? '';
$solution = $_POST['solution'] ?? 'No especificada';
$housingType = $_POST['housingType'] ?? 'No especificado';
$companyEmail = $_POST['companyEmail'];

// Generar enlace a Google Maps si tenemos coordenadas
$mapLink = '';
if (!empty($lat) && !empty($lng)) {
    $mapLink = "https://www.google.com/maps?q={$lat},{$lng}";
}

// Datos del archivo
$pdfFile = $_FILES['pdfFile']['tmp_name'];
$pdfFileName = $_FILES['pdfFile']['name'];

try {
    // Crear una instancia de PHPMailer
    $mail = new PHPMailer(true);
    
    // Configurar el servidor SMTP (ajustar según tu proveedor de correo)
    $mail->isSMTP();
    $mail->Host = 'smtp.tudominio.com'; // Reemplazar con tu servidor SMTP
    $mail->SMTPAuth = true;
    $mail->Username = 'cotizaciones@impulsoverde.cl'; // Reemplazar con tu email
    $mail->Password = 'tu_contraseña_segura'; // Reemplazar con tu contraseña
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    
    // Remitente
    $mail->setFrom('cotizaciones@impulsoverde.cl', 'Impulso Verde');
    
    // Destinatarios
    $mail->addAddress($customerEmail, $customerName); // Email del cliente
    $mail->addAddress($companyEmail, 'Impulso Verde'); // Email de la empresa
    
    // Adjuntar el archivo PDF
    $mail->addAttachment($pdfFile, $pdfFileName);
    
    // Contenido del correo
    $mail->isHTML(true);
    $mail->Subject = 'Cotización Impulso Verde - ' . $solution;
    
    // Crear la tabla de ubicación con enlace al mapa
    $locationHtml = '';
    if (!empty($mapLink)) {
        $locationHtml = "
            <tr>
                <th>Ubicación en mapa</th>
                <td><a href=\"{$mapLink}\" target=\"_blank\">Ver ubicación en Google Maps</a></td>
            </tr>
            <tr>
                <th>Coordenadas</th>
                <td>Latitud: {$lat}, Longitud: {$lng}</td>
            </tr>
        ";
        $locationText = "
- Ubicación en mapa: {$mapLink}
- Coordenadas: Latitud: {$lat}, Longitud: {$lng}";
    } else {
        $locationText = "";
    }
    
    // Cuerpo del correo HTML
    $mail->Body = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #43a48d; color: white; padding: 15px; text-align: center; }
            .content { padding: 20px; border: 1px solid #ddd; }
            .footer { background-color: #f7f7f7; padding: 15px; text-align: center; font-size: 12px; }
            h1 { color: #276a63; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
            th { background-color: #f4f4f4; }
            .map-container { margin: 20px 0; text-align: center; }
            .map-container img { max-width: 100%; height: auto; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Cotización Impulso Verde</h1>
            </div>
            <div class='content'>
                <p>Estimado/a <strong>$customerName</strong>,</p>
                <p>Gracias por solicitar una cotización con Impulso Verde. Adjunto encontrarás el detalle de la cotización solicitada.</p>
                
                <h2>Información de la Cotización:</h2>
                <table>
                    <tr>
                        <th>Nombre</th>
                        <td>$customerName</td>
                    </tr>
                    <tr>
                        <th>Dirección</th>
                        <td>$customerAddress</td>
                    </tr>
                    $locationHtml
                    <tr>
                        <th>Solución</th>
                        <td>$solution</td>
                    </tr>
                    <tr>
                        <th>Tipo de Vivienda</th>
                        <td>$housingType</td>
                    </tr>
                </table>
                
                <p>Para cualquier consulta adicional o para agendar una visita técnica, no dudes en contactarnos.</p>
                
                <p>
                    Atentamente,<br>
                    <strong>Equipo Impulso Verde</strong><br>
                    Teléfono: +56 9 1234 5678<br>
                    Email: contacto@impulsoverde.cl<br>
                    Web: www.impulsoverde.cl
                </p>
            </div>
            <div class='footer'>
                <p>© 2025 Impulso Verde - Todos los derechos reservados</p>
                <p>Este correo fue enviado a $customerEmail como respuesta a su solicitud de cotización.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Versión alternativa en texto plano
    $mail->AltBody = "
    Cotización Impulso Verde
    
    Estimado/a $customerName,
    
    Gracias por solicitar una cotización con Impulso Verde. Adjunto encontrarás el detalle de la cotización solicitada.
    
    Información de la Cotización:
    - Nombre: $customerName
    - Dirección: $customerAddress
    $locationText
    - Solución: $solution
    - Tipo de Vivienda: $housingType
    
    Para cualquier consulta adicional o para agendar una visita técnica, no dudes en contactarnos.
    
    Atentamente,
    Equipo Impulso Verde
    Teléfono: +56 9 1234 5678
    Email: contacto@impulsoverde.cl
    Web: www.impulsoverde.cl
    
    © 2025 Impulso Verde - Todos los derechos reservados
    Este correo fue enviado a $customerEmail como respuesta a su solicitud de cotización.
    ";
    
    // Enviar el correo
    $mail->send();
    
    // Respuesta exitosa
    header('Content-Type: application/json');
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    returnError('Error al enviar el correo: ' . $mail->ErrorInfo);
}