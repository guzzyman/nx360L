import NumberFormat from 'react-number-format';

export default function FormatToNumber (props) {
  const {inputRef, onChange, ...rest} = props;

  return (
    <NumberFormat
      {...rest}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange ({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      isNumericString
    />
  );
}
