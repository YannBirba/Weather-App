import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import background from "~/assets/background.png";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { activeCity$ } from "~/states";
import { useRouter } from "next/router";
import { useLayoutEffect } from "react";

const PublicHome: NextPage = () => {
  const { t: translation } = useTranslation("common");
  const router = useRouter();

  useLayoutEffect(() => {
    if (activeCity$.id.get() !== 0 && activeCity$.name.get() !== "") {
      void router.push("/home");
    }
  });

  return (
    <>
      <Head>
        <title>Weather.io</title>
        <meta name="description" content="An faboulus weather website" />
        <meta
          property="og:image"
          content="/_next/image?url=%2Fog-image.png&w=640&q=75"
        />
      </Head>
      <Image
        src={background}
        alt="background"
        className="-z-10 object-cover"
        fill
      />
      <div className="relative flex h-screen flex-col items-center justify-center gap-12">
        <h1 className="text-5xl md:text-8xl">Weather.io</h1>
        <Link
          href="/search"
          className="mt-4 rounded-lg bg-[#2d3142] px-3 py-2 text-2xl text-white transition duration-500 ease-in-out hover:shadow-2xl md:px-5 md:py-4 md:text-4xl"
        >
          {translation("start button")}
        </Link>
      </div>
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default PublicHome;
