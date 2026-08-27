import { 
  loginFirebaseEmail, 
  registerFirebaseCustomer, 
  loginFirebaseGoogle, 
  sendFirebasePasswordReset, 
  logoutFirebase 
} from '../firebase/auth';
import { UserProfile } from '../types';

export const mapFirebaseAuthError = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'Akun dengan email tersebut belum terdaftar. Silakan daftar terlebih dahulu.';
    case 'auth/wrong-password':
      return 'Kata sandi yang Anda masukkan salah. Silakan coba lagi atau gunakan fitur Lupa Password.';
    case 'auth/invalid-credential':
      return 'Email atau kata sandi yang Anda masukkan tidak sesuai. Mohon periksa kembali.';
    case 'auth/email-already-in-use':
      return 'Alamat email ini sudah terdaftar. Silakan masuk menggunakan akun Anda.';
    case 'auth/invalid-email':
      return 'Format alamat email tidak valid. Mohon periksa kembali.';
    case 'auth/weak-password':
      return 'Kata sandi terlalu pendek. Gunakan minimal 8 karakter.';
    case 'auth/user-disabled':
      return 'Akun ini telah dinonaktifkan. Silakan hubungi Customer Service PT Exindokarsa Agung.';
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan masuk gagal. Akses dibatasi sementara demi keamanan. Silakan coba lagi dalam beberapa menit.';
    case 'auth/popup-closed-by-user':
      return 'Proses autentikasi Google dibatalkan.';
    case 'auth/popup-blocked':
      return 'Popup browser diblokir. Izinkan popup untuk melanjutkan login dengan Google.';
    case 'auth/network-request-failed':
      return 'Koneksi internet terputus. Pastikan perangkat Anda terhubung ke internet.';
    default:
      return 'Terjadi kendala pada sistem autentikasi. Silakan coba beberapa saat lagi.';
  }
};

export const validateIndonesianPhone = (phone: string): boolean => {
  const clean = phone.replace(/[\s-]/g, '');
  // Accepts: 08xxx or +628xxx or 628xxx with 10 to 14 digits
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{7,11}$/;
  return phoneRegex.test(clean);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const authService = {
  loginWithEmail: async (emailOrPhone: string, pass: string): Promise<{ profile: UserProfile }> => {
    try {
      const isEmail = emailOrPhone.includes('@');
      let targetEmail = emailOrPhone.trim();
      
      // If user inputs phone number instead of email for login
      if (!isEmail) {
        const cleanPhone = emailOrPhone.replace(/[\s-]/g, '');
        targetEmail = `${cleanPhone}@customer.allkurma.id`;
      }

      const res = await loginFirebaseEmail(targetEmail, pass);
      return { profile: res.profile };
    } catch (err: any) {
      const msg = mapFirebaseAuthError(err?.code || '');
      throw new Error(msg);
    }
  },

  registerCustomer: async (
    name: string, 
    email: string, 
    phone: string, 
    pass: string
  ): Promise<{ profile: UserProfile }> => {
    try {
      const res = await registerFirebaseCustomer(name, email, phone, pass);
      return { profile: res.profile };
    } catch (err: any) {
      const msg = mapFirebaseAuthError(err?.code || '');
      throw new Error(msg);
    }
  },

  loginWithGoogle: async (): Promise<{ profile: UserProfile }> => {
    try {
      const res = await loginFirebaseGoogle();
      return { profile: res.profile };
    } catch (err: any) {
      const msg = mapFirebaseAuthError(err?.code || '');
      throw new Error(msg);
    }
  },

  forgotPassword: async (email: string): Promise<void> => {
    try {
      await sendFirebasePasswordReset(email);
    } catch (err: any) {
      // For security, don't expose if email does not exist unless network error
      if (err?.code === 'auth/network-request-failed') {
        throw new Error('Koneksi internet terputus. Mohon periksa jaringan Anda.');
      } else if (err?.code === 'auth/invalid-email') {
        throw new Error('Format alamat email tidak valid.');
      }
      // Non-revealing for other errors
    }
  },

  logout: async (): Promise<void> => {
    try {
      await logoutFirebase();
    } catch (err) {
      console.error('Logout error:', err);
    }
  }
};
