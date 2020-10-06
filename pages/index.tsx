import Head from "next/head";
import { getGithubPreviewProps, parseJson } from "next-tinacms-github";
import { GetStaticProps } from "next";

export default function Home({ file }) {
  const data = file.data;

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="title">
          {/* Render the title from `home.json` */}
          {data.title}
        </h1>
        //...
      </main>
      //...
    </div>
  );
}

// Fetch data with getStaticProps based on 'preview' mode
export const getStaticProps: GetStaticProps = async function ({
  preview,
  previewData,
}) {
  if (preview) {
    return getGithubPreviewProps({
      ...previewData,
      fileRelativePath: "content/home.json",
      parse: parseJson,
    });
  }
  return {
    props: {
      sourceProvider: null,
      error: null,
      preview: false,
      file: {
        fileRelativePath: "content/home.json",
        data: (await import("../content/home.json")).default,
      },
    },
  };
};
