import React from "react";

interface InputProps {
	placeholder?: string;
	value?: string;
	type?: string;
	disabled?: boolean;
	error?: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

interface InputErrorProps {
	error: string | undefined;
}

export const InputError: React.FC<InputErrorProps> = ({error}) => {
	return (
		<div>
			{error && (
				<p className="mt-2 text-sm text-red-500">
				{error}
				</p>
			)}
		</div>
	);
}

const Input: React.FC<InputProps> = ({
	placeholder,
	value,
	type,
	disabled,
	onChange,
	error,
	...rest
}) => {
	return (<>
		<input
			{...rest}
			disabled={disabled}
			onChange={onChange}
			value={value}
			placeholder={placeholder}
			type={type}
			className="
				w-full
				p-4
				text-lg
				bg-neutral-900
				border-neutral-800
				rounded-md
				outline-none
				text-white
				focus:border-sky-500
				focus:border-2
				trransition
				disabled:bg-neutral-900
				disabled:opacity-70
				disabled:cursor-not-allowed
			"
		/>
		<InputError error={error} />
	</>);
}
 
export default Input;