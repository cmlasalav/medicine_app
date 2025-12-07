// pages/_app.jsx
import "../styles/global.css";
import { AuthProvider } from "../context/authContext";
import { ToastProvider } from "../components/Extra/ToastMessage";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import LoadingScreen from "../components/Extra/Loader";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let loadingStartTime = null;
    const MIN_LOADING_TIME = 500; // Tiempo mínimo de visualización en ms

    const handleStart = () => {
      loadingStartTime = Date.now();
      setLoading(true);
    };

    const handleComplete = () => {
      if (loadingStartTime) {
        const elapsedTime = Date.now() - loadingStartTime;
        const remainingTime = MIN_LOADING_TIME - elapsedTime;

        if (remainingTime > 0) {
          // Si no ha pasado el tiempo mínimo, esperar el tiempo restante
          setTimeout(() => {
            setLoading(false);
          }, remainingTime);
        } else {
          // Si ya pasó el tiempo mínimo, ocultar inmediatamente
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <>
      <Head>
        <title>Pastillero Virtual</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <ToastProvider />
        {loading && <LoadingScreen message="Cargando página..." />}
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}

export default MyApp;
