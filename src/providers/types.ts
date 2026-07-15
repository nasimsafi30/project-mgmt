// Types imported from theme-provider

export interface AppProvidersProps {
  children: React.ReactNode;
  theme?: string;
  accent?: string;
}

export interface ProviderComponentProps {
  children: React.ReactNode;
}

export type ProviderComponent = React.ComponentType<ProviderComponentProps>;
