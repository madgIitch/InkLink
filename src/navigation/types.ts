/**
 * Navigation types
 * Define the parameter list for each screen in your navigation
 */

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
