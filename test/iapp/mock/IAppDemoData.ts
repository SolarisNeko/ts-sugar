import {AbstractCommand, AbstractQuery} from "../../../src/iapp/IApp";

export class DemoCommand extends AbstractCommand {

    count = 0

    execute(): void {
        this.count = 1
    }

}

export class DemoQuery extends AbstractQuery<number> {

    count = 0

    execute(): number {
        this.count = 1
        return this.count;
    }


}

export class DemoEvent {

    count = 0


}