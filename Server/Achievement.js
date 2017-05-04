class Achievement {
	constructor(id, name, rule, check) {
		this.id = id;
		this.name = name;
		this.rule = rule;
		this.check = check;
	}

	achieved(value) {
		return this.check(value);
	}

	getId() {
		return this.id;
	}

	getName() {
		return this.name;
	}

	getRule() {
		return this.rule;
	}
}

module.exports = Achievement;