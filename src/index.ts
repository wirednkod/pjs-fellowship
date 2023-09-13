import { ApiPromise, WsProvider } from "@polkadot/api";
import * as Sc from "@substrate/connect";
import { ScProvider } from "@polkadot/rpc-provider";

// const wsProvider = new WsProvider("wss://kusama-rpc.polkadot.io");
// const api = new ApiPromise({ provider: wsProvider });

const mapId = (id: any) => {
  if (!id) return;
  const info = Object.fromEntries(
    Object.entries(id.info)
      .map(([key, value]) => [key, value])
      .filter(
        ([, value]) =>
          value &&
          !Object.keys(value as any).includes("None") &&
          value !== "None"
      )
  );
  delete info["additional"];
  return info;
};

const main = async () => {
  const provider = new ScProvider(Sc, Sc.WellKnownChain.ksmcc3);
  await provider.connect();
  const api = new ApiPromise({ provider });
  await api.isReady;
  try {
    const fellowshipMembers = await api.query.fellowshipCollective.members;

    const keys = await fellowshipMembers.keys();
    const fellowMembersId = keys.map(({ args: [id] }) => {
      return id;
    });

    const promises: any[] = [];
    fellowMembersId.forEach((member: any) => {
      promises.push(api.query.identity.identityOf(member));
    });

    const results = await Promise.all(promises);

    results.forEach((m) => {
      let res = mapId(m.toHuman());
      res && console.log(res);
    });
  } catch (e) {
    console.log("error: ", e);
  }
};

main();
