import type {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import type { UserData } from "../models";

export const userConverter: FirestoreDataConverter<UserData> = {
  fromFirestore(
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options: SnapshotOptions,
  ) {
    return snapshot.data(options) as UserData;
  },
  toFirestore(user: UserData) {
    return user;
  },
};
