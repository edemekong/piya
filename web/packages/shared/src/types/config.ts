export type ImportMetaWithEnv = ImportMeta & {
  env?: Record<string, string | undefined>;
};

export type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};
