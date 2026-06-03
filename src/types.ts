/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StudentProfile {
  firstName: string;
  thirdName: string;
  studentPhone: string;
  guardianPhone: string;
  walletType: string;
  governorate: string;
  secondaryStage: 'first' | 'second' | 'third';
  email: string;
  avatarUrl: string;
  balance: number;
}

export type ViewType =
  | 'home'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'stage-detail'
  | 'subject-detail'
  | 'student-profile';

export type LanguageType = 'ar' | 'en';

export type StageType = 'first' | 'second' | 'third';

export interface Subject {
  id: string;
  nameAr: string;
  nameEn: string;
  iconName: string;
  color: string;
  videos: Video[];
}

export interface Video {
  id: string;
  titleAr: string;
  titleEn: string;
  durationAr: string;
  durationEn: string;
  url: string;
  thumbnail: string;
}
