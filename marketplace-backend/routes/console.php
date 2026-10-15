<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Artisan::command('app:create-admin {email} {--name=}', function () {
    $email = strtolower(trim($this->argument('email')));
    $name = trim($this->option('name') ?: $this->ask('Nom complet'));
    $password = $this->secret('Mot de passe administrateur (12 caractères minimum)');
    $passwordConfirmation = $this->secret('Confirmer le mot de passe');

    if ($password !== $passwordConfirmation) {
        $this->error('Les mots de passe ne correspondent pas.');
        return 1;
    }

    $validator = Validator::make([
        'name' => $name,
        'email' => $email,
        'password' => $password,
    ], [
        'name' => 'required|string|max:100',
        'email' => 'required|email',
        'password' => 'required|string|min:12',
    ]);

    if ($validator->fails()) {
        foreach ($validator->errors()->all() as $error) {
            $this->error($error);
        }
        return 1;
    }

    User::updateOrCreate(
        ['email' => $email],
        [
            'name' => $name,
            'password_hash' => Hash::make($password),
            'role' => 'admin',
            'account_status' => 'active',
            'risk_level' => 'reliable',
        ]
    );

    $this->info("Administrateur prêt : {$email}");
    return 0;
})->purpose('Créer ou promouvoir un administrateur depuis le terminal du serveur');
