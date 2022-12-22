export type NoderInterface = {
  id: number;
  title: string;
  desc: string;
  stamp: string;
  notif_id: string;
};
export type StackParamInterface = {
  Noder: undefined;
  "New Noder": undefined;
  "Noder Detail": { id: number; notif_id: string };
};
export type AppContextInterface = {
  noders: NoderInterface[];
  setNoders: (noders: NoderInterface[]) => void;
};
