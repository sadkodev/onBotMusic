import * as p from '@clack/prompts'

interface SelectOption {
	value: string
	label: string
	hint?: string
}

interface SelectOptions {
	message: string
	options: SelectOption[]
}

export async function select_answer(opts: SelectOptions) {
	const answer = await p.select(opts)

	return answer
}

export async function text_answer(opts: p.TextOptions) {
	const string_text = await p.text({
		message: opts.message,
		placeholder: opts.placeholder,
		initialValue: opts.initialValue,
		validate(value) {
			if (value.length === 0) {
				return 'Please enter a value'
			}
		},
	})

	if (p.isCancel(string_text)) {
		p.cancel('Operation canceled')
		process.exit(0)
	}

	return string_text
}
