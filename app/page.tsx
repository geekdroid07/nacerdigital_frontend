"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

interface GitHubProfile {
  name?: string;
  login: string;
  bio?: string;
  public_repos?: number;
  followers?: number;
  following?: number;
  avatar_url?: string;
  html_url?: string;
  company?: string | null;
  location?: string | null;
  blog?: string | null;
  twitter_username?: string | null;
}

export default function Home() {
  const [username, setUsername] = useState("geekdroid07");
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (value: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get<GitHubProfile>(`${backendUrl}/user/${value}`);
      setProfile(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchProfile("geekdroid07");
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <label className="flex-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Username de GitHub
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 outline-none ring-0 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              placeholder="Ej. octocat"
            />
          </label>
          <button
            onClick={() => fetchProfile(username)}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Buscar
          </button>
        </div>

        <div className="flex items-center gap-6">
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.login}
              className="h-24 w-24 rounded-full border border-zinc-200 object-cover dark:border-zinc-800"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-200 text-2xl font-semibold dark:bg-zinc-800">
              {profile?.login?.[0]?.toUpperCase() ?? "G"}
            </div>
          )}

          <div>
            <h1 className="text-3xl font-semibold">
              {profile?.name ?? profile?.login ?? "Cargando perfil..."}
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              @{profile?.login ?? "github"}
            </p>
          </div>
        </div>

        {loading && <p>Cargando información del perfil...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {profile && !loading && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-zinc-100 p-4 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500">Biografía</p>
              <p className="mt-2 text-base">{profile.bio || "Sin biografía disponible"}</p>
            </div>
            <div className="rounded-xl bg-zinc-100 p-4 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500">Estadísticas</p>
              <div className="mt-2 flex flex-wrap gap-4 text-sm">
                <span>Repos públicos: {profile.public_repos ?? 0}</span>
                <span>Seguidores: {profile.followers ?? 0}</span>
                <span>Siguiendo: {profile.following ?? 0}</span>
              </div>
            </div>
            <div className="rounded-xl bg-zinc-100 p-4 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500">Información adicional</p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>Empresa: {profile.company || "No especificada"}</li>
                <li>Ubicación: {profile.location || "No especificada"}</li>
                <li>Blog: {profile.blog || "No especificado"}</li>
                <li>Twitter: {profile.twitter_username || "No especificado"}</li>
              </ul>
            </div>
            <div className="rounded-xl bg-zinc-100 p-4 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500">Perfil</p>
              <a
                href={profile.html_url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
              >
                Ver en GitHub
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
