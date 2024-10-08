import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IPracticesUploaderProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
  webURL: string;
}
