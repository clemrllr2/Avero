export interface NetworkMessage {
  tone: "success" | "error" | "info";
  text: string;
}

const ERRORS: Record<string, string> = {
  cancelled: "Connexion annulée.",
  invalid_state: "La connexion a été refusée par sécurité. Réessaie.",
  not_professional:
    "Ce compte Instagram n'est pas professionnel. Passe-le en compte Créateur ou Entreprise dans l'application Instagram, puis réessaie.",
  already_linked: "Ce compte est déjà relié à un autre profil AVERO.",
  sync_failed: "Mise à jour impossible, réessaie plus tard.",
  connect_failed: "La connexion a échoué. Réessaie dans un instant.",
  expired: "L'accès à ton compte a expiré. Reconnecte-le pour mettre tes statistiques à jour.",
  not_configured: "La connexion à ce réseau n'est pas encore configurée. Réessaie plus tard.",
};

const SUCCESSES: Record<string, string> = {
  connected: "Compte connecté. Tes statistiques sont à jour.",
  refreshed: "Statistiques mises à jour.",
  disconnected: "Réseau déconnecté. Ses données ont été supprimées.",
  up_to_date: "Tes statistiques sont déjà à jour.",
};

type Params = Record<string, string | string[] | undefined>;

/** Message à afficher sur « Mes réseaux » d'après ?error= ou ?success= ; null si rien de connu. */
export function networkMessage(params: Params): NetworkMessage | null {
  const error = params.error;
  const success = params.success;
  if (typeof error === "string" && Object.hasOwn(ERRORS, error)) return { tone: "error", text: ERRORS[error] };
  if (typeof success === "string" && Object.hasOwn(SUCCESSES, success)) {
    return { tone: "success", text: SUCCESSES[success] };
  }
  return null;
}
