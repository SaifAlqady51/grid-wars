import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardTypeOptions,
  TextInputProps,
} from "react-native";
import {
  Controller,
  Control,
  FieldError,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { globalStyles } from "../../styles";

interface FormInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  errors: Partial<Record<FieldPath<T>, FieldError>>;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?:
  | "email"
  | "password"
  | "off"
  | "username"
  | "new-password"
  | "current-password";
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  maxLength?: number;
  textInputProps?: Partial<TextInputProps>;
}

export const FormInput = <T extends FieldValues>({
  name,
  control,
  errors,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  autoComplete,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  maxLength,
  textInputProps,
}: FormInputProps<T>) => {
  const fieldError = errors[name];

  return (
    <View style={styles.inputContainer}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              fieldError && styles.inputError,
              multiline && styles.multilineInput,
              !editable && styles.disabledInput,
            ]}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={value || ""}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoComplete={autoComplete}
            multiline={multiline}
            numberOfLines={numberOfLines}
            editable={editable}
            maxLength={maxLength}
            {...textInputProps}
          />
        )}
      />
      {fieldError && <Text style={styles.errorText}>{fieldError.message}</Text>}
      {maxLength && (
        <Text style={styles.characterCount}>
          {(control._getWatch(name) || "").length}/{maxLength}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: globalStyles.colors.text,
  },
  inputError: {
    borderColor: "#EF4444",
    borderWidth: 2,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  disabledInput: {
    backgroundColor: "#F3F4F6",
    color: "#6B7280",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  characterCount: {
    color: "#6B7280",
    fontSize: 11,
    textAlign: "right",
    marginTop: 2,
  },
});
