import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { useRouter } from 'expo-router';
import { useLoginWithEmail, usePrivy, PrivyUser } from '@privy-io/expo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import baseStyles from '@/styles/style';
import images from '@/styles/images';
import { GenericNavigationProps } from '../interface/types';
import CustomToast from '@/components/ui/CustomToaster';

import PrimaryButton from '@/components/ui/PrimaryButton';
import PrimaryInput from '@/components/ui/PrimaryInput';
import SmallIcon from '@/components/ui/SmallIcon';

interface SlideData {
  email: string;
  verificationCode: string;
  firstName: string;
  lastName: string;
  profilePhoto: string;
}

const OnboardingScreen = () => {
  const router = useRouter();
  const sliderRef = useRef<AppIntroSlider | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const { sendCode, loginWithCode } = useLoginWithEmail({
    onLoginSuccess: (user: PrivyUser, isNewUser?: Boolean) => {
      if (user) {
        const address = user.linked_accounts.find(account => account.type === "wallet")?.address || null;
        setWalletAddress(address);
        sliderRef.current?.goToSlide(2);
      }
    },
    onError: (error: Error) => {
      if (error.message === 'Invalid email and code combination') {
        CustomToast.show({
          message: 'Please enter correct code.',
          type: 'warning',
          position: 'top',
        });
      }

      if (error.message.includes('Already logged')) {
        CustomToast.show({
          message: 'You have already created account.',
          type: 'warning',
          position: 'top',
        });
      }
    },
  });

  const { logout } = usePrivy();
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState<SlideData>({
    email: '',
    verificationCode: '',
    firstName: '',
    lastName: '',
    profilePhoto: '',
  });

  const validateEmail = (email: string) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
  };

  const pickImage = async () => {
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ['images'],
    //   allowsEditing: true,
    //   aspect: [4, 3],
    //   quality: 1,
    // });

    // if (!result.canceled) {
    //   setImage(result.assets[0].uri);
    // }
  };

  const handleEmailAuthentication = async () => {
    logout();
    try {
      const result = await sendCode({ email: formData.email });
      if (result.success === true) {
        sliderRef.current?.goToSlide(1);
      } else {
        CustomToast.show({
          message: 'Failed sending code.',
          type: 'warning',
          position: 'top',
        });
      }
    } catch (error) {
      CustomToast.show({
        message: 'Please enter correct mail address.',
        type: 'warning',
        position: 'top',
      });
    }
  };

  const handleUserLoginWithCode = async () => {
    try {
      const result = await loginWithCode({
        code: formData.verificationCode,
        email: formData.email
      });
    } catch (error) {
    }
  };


  const slides = [
    {
      key: '1',
      type: 'email',
      component: () => (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 0.5 }}>
            <View style={[baseStyles.bgImgContainer]}>
              <ImageBackground
                source={images.onboarding.OnboardingTop}
                style={[baseStyles.bgImage, { alignItems: 'center' }]}
                resizeMode="cover">
                <View style={styles.contentContainer}>
                  <Text style={styles.welcomeText}>Welcome to Today</Text>
                  <Text style={styles.title}>Enter your{'\n'}email address</Text>
                  <PrimaryInput
                    style={{ marginTop: 38 }}
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    placeholder="Your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </ImageBackground>
            </View>
          </View>
          <View style={{ flex: 0.1 }}>
          </View>
          <View style={{ flex: 0.4 }}>
            <View style={[baseStyles.bgImgContainer]}>
              <ImageBackground
                source={images.onboarding.OnboardingBottom}
                style={baseStyles.bgImage}
                resizeMode="stretch"
              />
            </View>
            <View style={[baseStyles.bottomContainer, { alignItems: 'center', justifyContent: 'center' }]}>
              <PrimaryButton title="Continue" style={[{ marginTop: '40%' }, !validateEmail(formData.email) && styles.buttonDisabled]}
                disabled={!validateEmail(formData.email)} onPress={() => handleEmailAuthentication()} />
            </View>
          </View>
        </View>
      ),
    },
    {
      key: '2',
      type: 'verification',
      component: () => (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 0.5 }}>
            <View style={[baseStyles.bgImgContainer]}>
              <ImageBackground
                source={images.onboarding.OnboardingTop}
                style={[baseStyles.bgImage, { alignItems: 'center' }]}
                resizeMode="cover">
                <View style={styles.contentContainer}>
                  <SmallIcon source={images.onboarding.MailIcon} />
                  <Text style={styles.title}>Check your email</Text>
                  <Text style={[styles.subtitle, { marginTop: 14 }]}>We just sent a security code to{'\n'}{formData.email}</Text>
                  <PrimaryInput
                    style={{ marginTop: 24 }}
                    value={formData.verificationCode}
                    onChangeText={(text) => setFormData({ ...formData, verificationCode: text })}
                    placeholder="Enter the code"
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>
              </ImageBackground>
            </View>
          </View>
          <View style={{ flex: 0.1 }}>
          </View>
          <View style={{ flex: 0.4 }}>
            <View style={[baseStyles.bgImgContainer]}>
              <ImageBackground
                source={images.onboarding.OnboardingBottom}
                style={baseStyles.bgImage}
                resizeMode="stretch"
              />
            </View>
            <View style={[baseStyles.bottomContainer, { alignItems: 'center', justifyContent: 'center' }]}>
              <PrimaryButton title="Continue" style={[{ marginTop: '40%' }, formData.verificationCode.length !== 6 && styles.buttonDisabled]}
                disabled={formData.verificationCode.length !== 6}
                onPress={() => handleUserLoginWithCode()} />
            </View>
          </View>
        </View>
      ),
    },
    {
      key: '3',
      type: 'name',
      component: () => (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 0.5 }}>
            <View style={[baseStyles.bgImgContainer]}>
              <ImageBackground
                source={images.onboarding.OnboardingTop}
                style={[baseStyles.bgImage, { alignItems: 'center' }]}
                resizeMode="cover"
              >
                <View style={styles.contentContainer}>
                  <SmallIcon source={images.onboarding.UserIcon} />
                  <Text style={styles.title}>What is your name?</Text>
                  <Text style={[styles.subtitle, { marginTop: 14 }]}>Your name is how others find you on Today.{'\n'}You can change this later.</Text>
                  <PrimaryInput
                    style={{ marginTop: 24 }}
                    value={formData.firstName}
                    onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                    placeholder="First name"
                  />
                  <PrimaryInput
                    style={{ marginTop: 10 }}
                    value={formData.lastName}
                    onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                    placeholder="Last name"
                  />
                </View>
              </ImageBackground>
            </View>
          </View>
          <View style={{ flex: 0.1 }}>
          </View>
          <View style={{ flex: 0.4 }}>
            <View style={[baseStyles.bgImgContainer]}>
              <ImageBackground
                source={images.onboarding.OnboardingBottom}
                style={baseStyles.bgImage}
                resizeMode="stretch"
              />
            </View>
            <View style={[baseStyles.bottomContainer, { alignItems: 'center', justifyContent: 'center' }]}>
              <PrimaryButton title="Continue" style={[{ marginTop: '40%' }, !(formData.firstName && formData.lastName) && styles.buttonDisabled]}
                disabled={!(formData.firstName && formData.lastName)}
                onPress={() => sliderRef.current?.goToSlide(3)} />
            </View>
          </View>
        </View>
      ),
    },
    {
      key: '4',
      type: 'photo',
      component: () => (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 0.5 }}>
            <View style={[baseStyles.bgImgContainer]}>
              <ImageBackground
                source={images.onboarding.OnboardingTop}
                style={[baseStyles.bgImage, { alignItems: 'center' }]}
                resizeMode="cover"
              >
                <View style={styles.contentContainer}>
                  <SmallIcon source={images.onboarding.UserIcon} />
                  <Text style={styles.title}>Add a profile photo</Text>
                  <Text style={[styles.subtitle, { marginTop: 14 }]}>
                    Your profile photo is how you show up,{'\n'}you can change this later
                  </Text>
                  <View style={styles.photoUpload}>
                    <View style={styles.profilePhoto}>
                      <View >
                        {image ? (
                          <Image source={{ uri: image }} />
                        ) : (
                          <View >
                            <View>
                              <FontAwesome6 name="user-large" size={24} color="black" />
                            </View>
                          </View>
                        )}
                      </View>
                    </View>

                    <TouchableOpacity onPress={pickImage}>
                      <Text>Upload</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ImageBackground>
            </View>
          </View>
          <View style={{ flex: 0.1 }}>
          </View>
          <View style={{ flex: 0.4 }}>
            <View style={[baseStyles.bgImgContainer]}>
              <ImageBackground
                source={images.onboarding.OnboardingBottom}
                style={baseStyles.bgImage}
                resizeMode="stretch"
              />
            </View>
            <View style={[baseStyles.bottomContainer, { alignItems: 'center', justifyContent: 'center' }]}>
              <PrimaryButton
                title="Let's go!"
                style={{ marginTop: '40%' }}
                onPress={() => router.replace('/(tabs)')}
              />
            </View>
          </View>
        </View>
      ),
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <AppIntroSlider
        ref={sliderRef}
        data={slides}
        renderItem={({ item }) => item.component()}
        showNextButton={false}
        showDoneButton={false}
        showSkipButton={false}
        scrollEnabled={false}
      />
      <CustomToast />
    </View>
  );
};

const styles = StyleSheet.create({
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  contentContainer: {
    marginTop: '60%',
    width: '90%',
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'PlayfairDisplay-Medium',
  },
  title: {
    fontSize: 36,
    fontWeight: '500',
    letterSpacing: -0.25,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
    lineHeight: 21,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 15,
    fontSize: 16,
    borderRadius: 12,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  photoUpload: {
    width: 184,
    height: 198,
    borderRadius: 12,
    borderColor: '#E4E4E7',
    padding: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:24
  },
  profilePhoto: {
    width: 100,
    height: 100,
    paddingHorizontal: 24,
    paddingVertical: 25,
    borderRadius: 100,
    backgroundColor: '#F4F4F5'
  },
  uploadText: {
    color: '#666',
  },
});

export default OnboardingScreen;