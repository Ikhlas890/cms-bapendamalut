import { Component } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                             <img
                        src="assets/img/malut-logo.png"
                        alt="Image"
                        class="logo-bapenda-login mb-3"
                             />
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">CMS Maluku Utara!</div>
                            <span class="text-muted-color font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <label for="username" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Username</label>
                            <input pInputText id="username" type="text" placeholder="Username" class="w-full md:w-120 mb-8" [(ngModel)]="username" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <div class="flex items-center">
                                    <p-checkbox [(ngModel)]="checked" id="rememberme1" binary class="mr-2"></p-checkbox>
                                    <label for="rememberme1">Remember me</label>
                                </div>
                                <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
                            </div>
                            <p-button label="Sign In" styleClass="w-full" (onClick)="onSubmit()"></p-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login {
    username: string = '';
    password: string = '';
    checked: boolean = false;
    error: string | null = null;

    listImage = [
        'assets/img/malut-logo.png'
    ]

    constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    }

    onSubmit() {
        this.error = null;

        if (!this.username || !this.password) {
            this.error = 'Mohon lengkapi username dan password Anda.';
            return;
        }

        this.auth.login({ username: this.username, password: this.password }).subscribe({
            next: () => this.router.navigate(['/dashboard']),
            error: err => {
                this.error = err.error?.message || 'Login gagal! Username atau password salah. Silakan coba lagi.';
                console.error('Login error:', err);
            }
        });
    }

}
