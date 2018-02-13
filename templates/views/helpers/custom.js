module.exports = {
	/**
	 * Usage:
	 * {{#iff name '==' 'Foo'}}
     *    true
     * {{else}}
     *    false
     * {{/iff}}
	 *
	 * {{else}} block is optional
	 */
	iff: function (a, operator, b, options) {
		var bool = false;
		switch (operator) {
			case '==':
				// eslint-disable-next-line 
				bool = a == b;
				break;
			case '===':
				bool = a === b;
				break;
			case '>':
				bool = a > b;
				break;
			case '<':
				bool = a < b;
				break;
			default:
				throw new Error('Unknown operator ' + operator);
		}

		if (bool) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	},

	/**
	* Usage:
	* {{ifx name 'True' 'False'}}
	*/
	ifx: function (condition, ifVal, elseVal) {
		return condition ? ifVal : elseVal;
	},

	/**
	 * Usage:
	 * {{isSameUser user '123456789'}}
	 *
	 * {{#if (isSameUser user '12345') }}
     *    True
     * {{else}}
     *    False
     * {{/if}}
	 */
	isSameUser: function (user, userId) {
		return !!(user && user.id === userId);
	},

	/**
	 * Usage:
	 * {{isSameCategory category '123456789'}}
	 *
	 *
	 * {{ifx (isSameCategory category '123456789') 'active' ''}}
	 *
	 * {{#if (isSameCategory category '12345') }}
     *    True
     * {{else}}
     *    False
     * {{/if}}
	 */
	isSameCategory: function (category, categoryId) {
		return !!(category && category.id === categoryId);
	},


};
