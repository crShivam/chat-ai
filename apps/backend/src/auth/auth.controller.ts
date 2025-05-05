import {
  Body,
  Controller,
  Post,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Controller('auth')
export class AuthController {
  private supabase;

  constructor(private configService: ConfigService) {
    // Initialize Supabase client
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new InternalServerErrorException(
        'Supabase configuration is missing',
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  @Post('send-token')
  async sendTokenEmail(@Body() body: { email: string }) {
    const { email } = body;

    try {
      const redirectUrl = this.configService.get<string>('FRONTEND_URL');

      // Use Supabase to send a magic link email
      const { data, error } = await this.supabase.auth.signInWithOtp({
        email,
        options: {
          // You can customize email settings here
          ...(redirectUrl && { emailRedirectTo: redirectUrl }),
        },
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return {
        success: true,
        message: 'Authentication link has been sent to your email',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send authentication email',
      };
    }
  }
}
