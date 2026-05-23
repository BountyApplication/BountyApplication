// Admin-Passwort hier ändern.
// Hinweis: rein clientseitige Prüfung – das Passwort liegt im JS-Bundle.
// Reicht, um neugierige Kinder fernzuhalten, ist aber keine echte Sicherheit.
export const ADMIN_PASSWORD = "bounty2024";

export function isAdminUnlocked() {
    return sessionStorage.getItem("adminUnlocked") === "1";
}

export function unlockAdmin() {
    sessionStorage.setItem("adminUnlocked", "1");
}

export function checkAdminPassword(input) {
    return input === ADMIN_PASSWORD;
}
