/**
 * Navigation types
 * Define the parameter list for each screen in your navigation
 */

export type RootStackParamList = {
  // Auth Stack
  Welcome: undefined;
  Login: undefined;
  Register: undefined;

  // Profile Setup
  ProfileSetup: undefined;

  // Main Stack
  Home: undefined;
  Profile: undefined;
  EditProfile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
