import "../styles/globals.css";
import { TinaCMS, TinaProvider } from "tinacms";
import {
  GithubClient,
  GithubMediaStore,
  TinacmsGithubProvider,
} from "react-tinacms-github";
import { debug } from "console";

export interface EditLinkProps {
  cms: TinaCMS;
}

export const EditLink = ({ cms }: EditLinkProps) => {
  return (
    <button onClick={() => cms.toggle()}>
      {cms.enabled ? "Exit Edit Mode" : "Edit This Site"}
    </button>
  );
};

const MyApp = ({ Component, pageProps }) => {
  const github = new GithubClient({
    proxy: "/api/proxy-github",
    authCallbackRoute: "/api/create-github-access-token",
    clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
    baseRepoFullName: process.env.NEXT_PUBLIC_REPO_FULL_NAME, // e.g: tinacms/tinacms.org,
  });

  const cms = new TinaCMS({
    enabled: !!pageProps.preview,
    apis: {
      //  2. Register the GithubClient
      github,
    },
    //  3. Register the Media Store
    media: new GithubMediaStore(github),
    //  4. Use the Sidebar and Toolbar
    sidebar: pageProps.preview,
    toolbar: pageProps.preview,
  });

  const onLogin = async () => {
    const token = localStorage.getItem("tinacms-github-token") || null;
    const headers = new Headers();

    if (token) {
      headers.append("Authorization", "Bearer " + token);
    }

    const response = await fetch(`/api/preview`, { headers: headers });
    const data = await response.json();

    if (response.status == 200) window.location.href = window.location.pathname;
    else throw new Error(data.message);
  };

  const onLogout = () => {
    return fetch(`/api/reset-preview`).then(() => {
      window.location.reload();
    });
  };

  return (
    //  5. Wrap the page Component with the Tina and Github providers
    <TinaProvider cms={cms}>
      <TinacmsGithubProvider
        onLogin={onLogin}
        onLogout={onLogout}
        error={pageProps.error}
      >
        {/* 6. Add a button for entering Preview/Edit Mode */}
        <EditLink cms={cms} />
        <Component {...pageProps} />
      </TinacmsGithubProvider>
    </TinaProvider>
  );
  // return <Component {...pageProps} />;
};

export default MyApp;
