/**
 * This file was automatically generated by joi-to-typescript
 * Do not modify this file manually
 */

export interface PersonFormSchema {
  /**
   * Unknown Property
   */
  [x: string]: any;
  dob: Date;
  name: string;
  password: string;
  repeatPassword: string;
  sex?: 'M' | 'F' | 'O';
}
