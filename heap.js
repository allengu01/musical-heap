export class Heap {
    constructor() {
        this.items = [0];
    }

    swapIndices(i, j) {
        const tmp = this.items[i];
        this.items[i] = this.items[j];
        this.items[j] = tmp;
    }

    size() {
        return this.items.length - 1;
    }

    get(i) {
        if (i > 0 && i <= this.items.length) {
            return this.items[i];
        }
        return undefined;
    }

    // sink operation with an optional callback
    sink(i, visit) {
        if (visit === null) {
            return;
        }
        visit(i, () => {
            const curr = this.get(i);
            const leftChild  = this.get(2 * i);
            const rightChild = this.get(2 * i + 1);
            if (leftChild === undefined && rightChild === undefined) {
                return;
            }
            else if (rightChild === undefined) {
                if (leftChild < curr) {
                    this.swapIndices(i, 2 * i);
                    this.sink(2 * i, visit);
                }
            }
            else {
                if (leftChild < curr || rightChild < curr) {
                    if (leftChild <= rightChild) {
                        this.swapIndices(i, 2 * i);
                        this.sink(2 * i, visit);
                    }
                    else {
                        this.swapIndices(i, 2 * i + 1)
                        this.sink(2 * i + 1, visit);
                    }
                }
            }
        });
    }

    swim(i, visit) {
        if (visit === null) {
            return;
        }

        visit(i, () => {
            if (i === 1) {
                return;
            }
            const curr = this.get(i);
            const parent = this.get(Math.floor(i / 2));
            if (parent > curr) {
                this.swapIndices(i, Math.floor(i / 2));
                this.swim(Math.floor(i / 2), visit);
            }
        });
    }

    insert(value, visit) {
        this.items.push(value);
        this.swim(this.size(), visit);
    }

    remove(visit) {
        const toReturn = this.items[1];
        if (visit === null) {
            return;
        }
        visit(1, () => {
            this.swapIndices(1, this.size());
            this.items.pop();
            this.sink(1, visit);
        });
        return toReturn;
    }

    toString() {
        var str = "";
        for (var i = 1; i <= this.size(); i++) {
            str += `${this.get(i)}`;
            if (i !== this.size()) {
                str += " ";
            }
        }
        return str;
    }
}