import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
// import { User } from '../user/interfaces/user.interface'; // Define your User interface
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  // Generate a new unique secret and a QR code URL for a user
  public async generateTotpSecret(email: string) {
    const secret = authenticator.generateSecret();
    // 'MyAppName' will appear in the authenticator app
    const otpauthUrl = authenticator.keyuri(email, 'SUPERCARS INC.', secret);

    // In a real application, you would save this secret to the user's database record
    // e.g., await this.usersService.setTwoFactorAuthenticationSecret(secret, user.userId);
    
    return {
      secret,
      otpauthUrl,
    };
  }

  // Generate a QR code data URL from the otpauth URL
  public async generateQrCodeDataURL(otpauthUrl: string): Promise<string> {
    return QRCode.toDataURL(otpauthUrl);
  }

  // Verify a user-provided TOTP token
  public isTotpValid(token: string, secret: string): boolean {
    return authenticator.verify({ token, secret });
  }

  // Check if a token is valid, considering a small time window (optional but recommended)
  public verifyTotpToken(token: string, secret: string): boolean {
    // A window allows for tokens that are slightly out of sync (e.g., within 30 seconds)
    console.log('TOKEN : ' + token);
    console.log('SECRET : ' + secret);
    authenticator.options = { window: 1 }; 
    return authenticator.check(token, secret);
  }
}
