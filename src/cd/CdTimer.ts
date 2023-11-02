class CdTimer {
    private cooldown: number;
    private isOnCooldown: boolean = false;

    constructor(cooldown: number) {
        this.cooldown = cooldown;
    }

    startCooldown() {
        if (!this.isOnCooldown) {
            this.isOnCooldown = true;
            setTimeout(() => {
                this.isOnCooldown = false;
            }, this.cooldown);
        } else {
            console.log('Ability is on cooldown');
        }
    }

    isCooldownActive() {
        return this.isOnCooldown;
    }
}