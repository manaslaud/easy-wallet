"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createBaseAccount } from "@/helpers/createAccount";
import { Input } from "@/components/Input";
import type { Account, KeyPair } from "@/types/account";
import { listAccounts, upsertAccount } from "@/helpers/indexedDB/storage";
import { sendEthereumTransaction } from "@/helpers/ethereum/sendEthereumTransaction";
import { sendSolanaTransaction } from "@/helpers/sendSolanaTransaction";
import { AccountSelector } from "@/components/AccountSelector";
import TransferForm from "@/components/TransferForm";
import { EthereumNetworkSelector, SolanaNetworkSelector } from "@/components/NetworkSelectors";
import { getEthereumBalance } from "@/helpers/getEthereumBalance";
import { getSolanaBalance } from "@/helpers/getSolanaBalance";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { KeyPairCard } from "@/components/KeyPairCard";
import { saveAccountPublic } from "@/helpers/saveAccountToServer";
import { listContacts as apiListContacts, createContact as apiCreateContact } from "@/helpers/contacts";
import type { Contact } from "@/types/contact";
import Contacts from "@/components/Contacts";
import Chat from "@/components/Chat";

export default function Home() {
  const [label, setLabel] = useState("");
  const [password, setPassword] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const lastCreated = useMemo(() => accounts[0], [accounts]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(undefined);
  const selectedAccount = useMemo(
    () => accounts.find((a) => a.id === selectedAccountId) || lastCreated,
    [accounts, selectedAccountId, lastCreated]
  );
  const [unlockPasswordById, setUnlockPasswordById] = useState<Record<string, string>>({});
  const [isUnlockedById, setIsUnlockedById] = useState<Record<string, boolean>>({});
  const [txState, setTxState] = useState<Record<string, { sending: boolean; result?: string; error?: string }>>({});
  const [solanaNet, setSolanaNet] = useState<"devnet" | "testnet" | "mainnet-beta">("devnet");
  const [ethereumNet, setEthereumNet] = useState<"sepolia" | "mainnet">("sepolia");
  const [ethereumRpcUrl, setEthereumRpcUrl] = useState<string>("");
  const [balances, setBalances] = useState<Record<string, { sol?: { lamports: number; sol: number }; eth?: { ether: string } }>>({});
  const [contacts, setContacts] = useState<Record<string, Contact[]>>({});

  useEffect(() => {
    const load = async () => {
      const items = await listAccounts();
      setAccounts(items);
      if (items.length > 0) setSelectedAccountId(items[0].id);
    };
    load();
  }, []);

  useEffect(() => {
    const acct = selectedAccount;
    if (!acct) return;
    const sol = acct.keyPairs.find((k) => k.chain === "solana");
    const eth = acct.keyPairs.find((k) => k.chain === "ethereum");
    (async () => {
      const next: any = {};
      if (sol) {
        try {
          const b = await getSolanaBalance(sol.address, solanaNet);
          next.sol = b;
        } catch {}
      }
      if (eth) {
        try {
          const b = await getEthereumBalance(eth.address, { network: ethereumNet, rpcUrl: ethereumRpcUrl || undefined });
          next.eth = { ether: b.ether };
        } catch {}
      }
      setBalances((prev) => ({ ...prev, [acct.id]: next }));
    })();
  }, [selectedAccount, solanaNet, ethereumNet, ethereumRpcUrl]);

  // Load contacts when account or network changes
  useEffect(() => {
    const acct = selectedAccount;
    if (!acct) return;
    (async () => {
      const entries: Array<{ key: string; list: Contact[] }> = [];
      try {
        const keySol = `${acct.id}|solana|${solanaNet}`;
        const listSol = await apiListContacts({ userAccountId: acct.id, chain: "solana", network: solanaNet });
        entries.push({ key: keySol, list: listSol });
      } catch {}
      try {
        const keyEth = `${acct.id}|ethereum|${ethereumNet}`;
        const listEth = await apiListContacts({ userAccountId: acct.id, chain: "ethereum", network: ethereumNet });
        entries.push({ key: keyEth, list: listEth });
      } catch {}
      setContacts((prev) => {
        const next = { ...prev };
        for (const e of entries) next[e.key] = e.list;
        return next;
      });
    })();
  }, [selectedAccount, solanaNet, ethereumNet]);

  const onCreate = useCallback(async () => {
    if (!password || !label) return;
    setIsCreating(true);
    try {
      const account = await createBaseAccount(password, label);
      await upsertAccount(account);
      // Persist public metadata to server (no private keys)
      void saveAccountPublic(account);
      setAccounts((prev) => [account, ...prev]);
      setLabel("");
      setPassword("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsCreating(false);
    }
  }, [password, label]);

  const renderKeyPair = (kp: KeyPair) => {
    return (
      <div className="rounded-lg border border-zinc-800 p-4 grid gap-2" key={`${kp.chain}-${kp.address}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm uppercase tracking-wide text-zinc-400">{kp.chain}</span>
          <span className="text-xs text-zinc-500">{kp.derivationPath}</span>
        </div>
        <div className="grid gap-1">
          <div className="text-xs text-zinc-400">Address</div>
          <div className="font-mono break-all text-sm">{kp.address}</div>
        </div>
        <div className="grid gap-1">
          <div className="text-xs text-zinc-400">Public Key</div>
          <div className="font-mono break-all text-sm">{kp.publicKey}</div>
        </div>
      </div>
    );
  };

  const getKeyPair = (acct: Account, chain: KeyPair["chain"]) =>
    acct.keyPairs.find((k) => k.chain === chain);

  const onUnlock = async (acct: Account) => {
    const pwd = unlockPasswordById[acct.id];
    if (!pwd) return;
    setIsUnlockedById((prev) => ({ ...prev, [acct.id]: true }));
  };

  const setTx = (key: string, value: Partial<{ sending: boolean; result?: string; error?: string }>) => {
    setTxState((prev) => {
      const existing = prev[key] || { sending: false };
      return { ...prev, [key]: { ...existing, ...value } };
    });
  };

  const onSendSol = async (acct: Account, to: string, amountSol: string) => {
    const pwd = unlockPasswordById[acct.id];
    const kp = getKeyPair(acct, "solana");
    if (!pwd || !kp) return;
    const key = `${acct.id}-sol`;
    setTx(key, { sending: true, result: undefined, error: undefined });
    try {
      const lamports = Math.floor(parseFloat(amountSol) * 1_000_000_000);
      const { signature } = await sendSolanaTransaction({
        password: pwd,
        packedEncryptedPrivateKey: kp.privateKey,
        toAddressBase58: to,
        lamports,
        network: solanaNet,
      });
      setTx(key, { sending: false, result: signature });
    } catch (err: any) {
      setTx(key, { sending: false, error: err?.message || String(err) });
    }
  };

  const onSendEth = async (acct: Account, to: string, amountEth: string) => {
    const pwd = unlockPasswordById[acct.id];
    const kp = getKeyPair(acct, "ethereum");
    if (!pwd || !kp) return;
    const key = `${acct.id}-eth`;
    setTx(key, { sending: true, result: undefined, error: undefined });
    try {
      const { hash } = await sendEthereumTransaction({
        password: pwd,
        packedEncryptedPrivateKey: kp.privateKey,
        toAddress: to,
        amountEther: amountEth,
        network: ethereumNet,
        rpcUrl: ethereumRpcUrl || undefined,
      });
      setTx(key, { sending: false, result: hash });
    } catch (err: any) {
      setTx(key, { sending: false, error: err?.message || String(err) });
    }
  };

  

  return (
    <main className="relative min-h-screen w-full">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_600px_at_50%_-20%,rgba(120,119,198,0.15),transparent),radial-gradient(800px_400px_at_80%_20%,rgba(16,185,129,0.12),transparent)]" />
      <div className="relative w-full max-w-5xl mx-auto p-6 md:p-10 grid gap-8">
        <header className="grid gap-2">
          <h1 className="text-3xl md:text-4xl font-bold">Easy Wallet</h1>
          <p className="text-zinc-400">Create accounts, view balances, and send on testnets.</p>
        </header>

        <Section title="Create account" subtitle="Securely generate your base wallets">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <label className="text-sm">Label</label>
              <Input value={label} onChange={setLabel} placeholder="My first wallet" required />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <label className="text-sm">Password</label>
              <Input
                type="password"
                required
                placeholder="Enter a strong password"
                value={password}
                onChange={setPassword}
                autoComplete="new-password"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={onCreate} disabled={!label || !password || isCreating}>
              {isCreating ? "Creating..." : "Create Base Account"}
            </Button>
          </div>
        </Section>

      {selectedAccount && (
        <Section
          title="Wallet"
          subtitle="Select an account, view balances and addresses"
          rightSlot={<div className="flex items-center gap-2"><Button variant="secondary" onClick={() => { setSolanaNet((v) => v); setEthereumNet((v) => v); }}>Refresh</Button></div>}
        >
          <div className="grid gap-3">
            <AccountSelector accounts={accounts} selectedId={selectedAccount.id} onChange={(id) => setSelectedAccountId(id)} />
            <p className="text-sm text-zinc-500">{selectedAccount.label} · {new Date(selectedAccount.createdAt).toLocaleString()}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {selectedAccount.keyPairs.map((kp) => (
              <KeyPairCard
                key={`${kp.chain}-${kp.address}`}
                kp={kp}
                balance={kp.chain === "solana"
                  ? (balances[selectedAccount.id]?.sol ? `${balances[selectedAccount.id].sol!.sol.toFixed(6)} SOL` : undefined)
                  : (balances[selectedAccount.id]?.eth ? `${balances[selectedAccount.id].eth!.ether} ETH` : undefined)}
              />
            ))}
          </div>
        </Section>
      )}

      {selectedAccount && (
        <Section title="Unlock and transfer" subtitle="Decrypt keys with your password to send transactions">
          {!isUnlockedById[selectedAccount.id] ? (
            <div className="grid md:grid-cols-3 gap-3">
              <div className="md:col-span-2 grid gap-2">
                <label className="text-sm">Wallet password</label>
                <Input
                  type="password"
                  placeholder="Password to decrypt keys"
                  value={unlockPasswordById[selectedAccount.id] || ""}
                  onChange={(val) =>
                    setUnlockPasswordById((prev) => ({ ...prev, [selectedAccount.id]: val }))
                  }
                  autoComplete="current-password"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={() => onUnlock(selectedAccount)} disabled={!unlockPasswordById[selectedAccount.id]}>Unlock</Button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-3">
                <SolanaNetworkSelector value={solanaNet} onChange={setSolanaNet} />
                <TransferForm
                  title="Send SOL (selected network)"
                  onSubmit={(to, amount) => onSendSol(selectedAccount, to, amount)}
                  pending={!!txState[`${selectedAccount.id}-sol`]?.sending}
                  resultLabel="Signature"
                  result={txState[`${selectedAccount.id}-sol`]?.result}
                  error={txState[`${selectedAccount.id}-sol`]?.error}
                  contacts={contacts[`${selectedAccount.id}|solana|${solanaNet}`]?.map((c) => ({ id: c.id, label: c.label, address: c.address }))}
                  onSaveContact={async (label, address) => {
                    await apiCreateContact({ userAccountId: selectedAccount.id, chain: "solana", network: solanaNet, address, label });
                    const list = await apiListContacts({ userAccountId: selectedAccount.id, chain: "solana", network: solanaNet });
                    setContacts((prev) => ({ ...prev, [`${selectedAccount.id}|solana|${solanaNet}`]: list }));
                  }}
                />
              </div>
              <div className="grid gap-3">
                <EthereumNetworkSelector value={ethereumNet} onChange={setEthereumNet} rpcUrl={ethereumRpcUrl} onRpcUrlChange={setEthereumRpcUrl} />
                <TransferForm
                  title="Send ETH (selected network)"
                  onSubmit={(to, amount) => onSendEth(selectedAccount, to, amount)}
                  pending={!!txState[`${selectedAccount.id}-eth`]?.sending}
                  resultLabel="Tx Hash"
                  result={txState[`${selectedAccount.id}-eth`]?.result}
                  error={txState[`${selectedAccount.id}-eth`]?.error}
                  contacts={contacts[`${selectedAccount.id}|ethereum|${ethereumNet}`]?.map((c) => ({ id: c.id, label: c.label, address: c.address }))}
                  onSaveContact={async (label, address) => {
                    await apiCreateContact({ userAccountId: selectedAccount.id, chain: "ethereum", network: ethereumNet, address, label });
                    const list = await apiListContacts({ userAccountId: selectedAccount.id, chain: "ethereum", network: ethereumNet });
                    setContacts((prev) => ({ ...prev, [`${selectedAccount.id}|ethereum|${ethereumNet}`]: list }));
                  }}
                />
              </div>
            </div>
          )}
        </Section>
      )}

      <Section title="Assistant" subtitle="Ask questions and get guidance in natural language">
        <Chat
          selectedAccount={selectedAccount}
          solanaNet={solanaNet}
          ethereumNet={ethereumNet}
          canSend={selectedAccount ? !!isUnlockedById[selectedAccount.id] : false}
          sendEth={selectedAccount ? async (to, amount) => {
            const acct = selectedAccount;
            const pwd = unlockPasswordById[acct.id];
            const kp = acct.keyPairs.find((k) => k.chain === "ethereum");
            if (!pwd || !kp) throw new Error("Wallet locked or no ETH key");
            const { sendEthereumTransaction } = await import("@/helpers/ethereum/sendEthereumTransaction");
            const res = await sendEthereumTransaction({
              password: pwd,
              packedEncryptedPrivateKey: kp.privateKey,
              toAddress: to,
              amountEther: amount,
              network: ethereumNet,
              rpcUrl: ethereumRpcUrl || undefined,
            });
            return res.hash;
          } : undefined}
          sendSol={selectedAccount ? async (to, amount) => {
            const acct = selectedAccount;
            const pwd = unlockPasswordById[acct.id];
            const kp = acct.keyPairs.find((k) => k.chain === "solana");
            if (!pwd || !kp) throw new Error("Wallet locked or no SOL key");
            const { sendSolanaTransaction } = await import("@/helpers/sendSolanaTransaction");
            const lamports = Math.floor(parseFloat(amount) * 1_000_000_000);
            const res = await sendSolanaTransaction({
              password: pwd,
              packedEncryptedPrivateKey: kp.privateKey,
              toAddressBase58: to,
              lamports,
              network: solanaNet,
            });
            return res.signature;
          } : undefined}
        />
      </Section>

      {selectedAccount && (
        <Section title="Contacts" subtitle="Create and view contacts per chain and network">
          <div className="grid md:grid-cols-2 gap-4">
            <Contacts
              title="Solana contacts"
              userAccountId={selectedAccount.id}
              chain="solana"
              network={solanaNet}
            />
            <Contacts
              title="Ethereum contacts"
              userAccountId={selectedAccount.id}
              chain="ethereum"
              network={ethereumNet}
            />
          </div>
        </Section>
      )}

      {accounts.length > 1 && (
        <Section title="All accounts" subtitle="Accounts created by you.">
          <div className="grid gap-3">
            {accounts.map((acct) => (
              <div key={acct.id} className="rounded-xl border border-zinc-800/70 bg-white/5 dark:bg-black/20 backdrop-blur p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{acct.label}</div>
                  <div className="text-xs text-zinc-500">{new Date(acct.createdAt).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
      </div>
    </main>
  );
}
