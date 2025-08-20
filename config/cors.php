<?php
return [
	'paths' => ['api/*', 'sanctum/csrf-cookie'],
	'allowed_origins' => ['http://localhost:5173'], // Vite dev server
	'allowed_headers' => ['*'],
	'allowed_methods' => ['*'],
	'supports_credentials' => true,
];
