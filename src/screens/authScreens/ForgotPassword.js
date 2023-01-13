import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from 'react-native';
import AuthButton from '../../components/utils/auth/AuthButton';
import BackButton from '../../components/utils/BackButton';
import TextInputFields from '../../components/utils/TextInputField';

const ForgotPassword = () => {
  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton />
        <View style={styles.accountRecovery}>
          <Text style={styles.title}>Account recovery</Text>
          <Text style={styles.recoverAccountInstructions}>
            {`Please enter your email\nto recover your account`}
          </Text>
          <Text style={styles.codeText}>
            {`You will receive a 6 digit code in \nyour email to verify next`}
          </Text>
        </View>
        <View style={styles.textInput}>
          <TextInputFields placeholder="email" keyboardType="email-address" />
        </View>
        <View style={styles.btn}>
          <AuthButton title="Sent OTP" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1C9A4E',
  },
  accountRecovery: {
    marginLeft: width * 0.1,
    marginTop: height * 0.12,
  },

  title: {
    color: '#F2F2F2',
    fontSize: 16,
    marginBottom: 5,
    opacity: 0.8,
  },
  recoverAccountInstructions: {
    fontSize: 21,
    color: '#F2F2F2',
    marginBottom: 30,
  },
  codeText: {
    fontSize: 16,
    color: '#F2F2F2',
    marginBottom: 30,
    opacity: 0.8,
  },
  textInput: {
    alignItems: 'center',
    marginTop: 25,
  },
  btn: {
    alignItems: 'center',
    marginTop: 25,
  },
});

export default ForgotPassword;
