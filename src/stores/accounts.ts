import { defineStore } from "pinia";
import { reactive, watch } from "vue";

export interface Label {
  text: string;
}

export interface Account {
  labels: Label[];
  type: "LDAP" | "Локальная";
  login: string;
  password: string | null;
}

const STORAGE_KEY = "saa_accounts_v1";

export const useAccountsStore = defineStore("accounts", () => {
  const accounts = reactive<Account[]>([]);

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Account[];
      if (Array.isArray(parsed)) {
        accounts.splice(
          0,
          accounts.length,
          ...parsed.map((a) => ({
            labels: Array.isArray(a.labels)
              ? a.labels.map((l) => ({ text: String(l.text || "") }))
              : [],
            type: (a.type === "Локальная"
              ? "Локальная"
              : "LDAP") as Account["type"],
            login: String(a.login || ""),
            password: a.type === "LDAP" ? null : a.password ?? null,
          }))
        );
      }
    } catch (e) {
      console.warn("Failed to load accounts from localStorage", e);
    }
  }

  load();

  watch(
    accounts,
    () => {
      const nonEmptyAccounts = accounts.filter(
        (a) =>
          a.login.trim().length > 0 &&
          (a.type === "LDAP" || (a.password && a.password.trim().length > 0))
      );
      nonEmptyAccounts.forEach((a) => {
        if (a.type === "LDAP") a.password = null;
      });

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nonEmptyAccounts));
      } catch (e) {
        console.warn("Failed to save accounts to localStorage", e);
      }
    },
    { deep: true }
  );

  function addAccount() {
    const hasEmpty = accounts.some(
      (a) =>
        a.login.trim().length === 0 ||
        (a.type !== "LDAP" && (!a.password || a.password.trim().length === 0))
    );
    if (hasEmpty) return;

    accounts.push({ labels: [], type: "LDAP", login: "", password: null });
  }

  function removeAccount(index: number) {
    accounts.splice(index, 1);
  }

  function setType(index: number, type: Account["type"]) {
    const a = accounts[index];
    if (!a) return;
    a.type = type;
    if (type === "LDAP") a.password = null;
  }

  return { accounts, addAccount, removeAccount, setType };
});
