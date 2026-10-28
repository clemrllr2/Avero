/** Message en français à partir du code d'erreur renvoyé par Better Auth. */
export function authErrorMessage(code: string | undefined): string {
  switch (code) {
    case "USER_ALREADY_EXISTS":
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
      return "Un compte existe déjà avec cet e-mail.";
    case "INVALID_EMAIL_OR_PASSWORD":
      return "E-mail ou mot de passe incorrect.";
    default:
      return "Une erreur est survenue. Réessayez dans un instant.";
  }
}
