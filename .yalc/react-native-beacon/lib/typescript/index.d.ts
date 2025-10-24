declare const Beacon: any;
type BeaconPayload = {
    id: string;
    uuid?: string;
    minor?: number;
    major?: number;
};
type Beacon = {
    uuid: string;
    distance?: number;
    major?: number;
    minor?: number;
};
type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};
export type Options = DeepPartial<{
    android: {
        notification: {
            id: number;
            contentTitle: string;
            contentText: string;
            channel: {
                id: string;
                name: string;
                description: string;
            };
            smallIcon: string;
        };
    };
}>;
declare const _default: {
    watchBeacons(callback: (beacons: Beacon[]) => void): void;
    setOptions(options: Options): void;
    requestPermissions(): Promise<boolean>;
    enableBluetooth(): void;
    startBeaconScan(beacons: BeaconPayload[]): Promise<void>;
    stopBeaconScan(): Promise<void>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map
