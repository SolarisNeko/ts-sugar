export class HeartbeatManager {
    intervals = {};

    startHeartbeat(taskName: string, intervalMs: number, callback: Function) {
        this.intervals[taskName] = setInterval(() => {
            callback();
        }, intervalMs);
    }

    cancelHeartbeat(taskName: string) {
        clearInterval(this.intervals[taskName]);
        delete this.intervals[taskName];
    }
}
