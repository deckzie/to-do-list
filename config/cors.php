<?php
return [
	'paths' => ['api/*', 'sanctum/csrf-cookie'],
	'allowed_origins' => ['http://localhost:5173', 'https://n9kcjszq-5173.asse.devtunnels.ms'], // Vite dev server
	'allowed_headers' => ['*'],
	'allowed_methods' => ['*'],
	'supports_credentials' => true,
];
