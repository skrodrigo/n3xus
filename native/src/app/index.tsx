import { useState, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Keyboard,
  Pressable,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useRouter } from 'expo-router'
import { useColorScheme } from '@/lib/useColorScheme'
import { LoginSheet } from '../components/auth/login-sheet'
import { RegisterSheet } from '@/components/auth/register-sheet'

export default function Index() {
  const [inputValue, setInputValue] = useState('')
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const inputRef = useRef<TextInput>(null)
  const { bottom } = useSafeAreaInsets()
  const router = useRouter()
  const { colorScheme } = useColorScheme()

  const handleSend = () => {
    if (!inputValue.trim()) return
    router.push({
      pathname: '/chat',
      params: { message: inputValue },
    })
  }

  return (
    <Pressable className="flex-1 bg-white dark:bg-black" onPress={() => Keyboard.dismiss()}>
      <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="h-10 w-10 items-center justify-center">
            <Image
              source={require('../../assets/logos/logo-white.png')}
              style={{ width: 32, height: 32 }}
              resizeMode="contain"
            />
          </View>

          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              className="px-4 py-2"
              onPress={() => setShowRegister(true)}
            >
              <Text className="text-sm font-medium text-black dark:text-white">
                Sign up free
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="rounded-full bg-black px-4 py-2 dark:bg-white"
              onPress={() => setShowLogin(true)}
            >
              <Text className="text-sm font-medium text-white dark:text-black">
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-center text-3xl font-semibold text-black dark:text-white">
            What can I help you with?
          </Text>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        style={{ position: 'absolute', bottom, left: 0, right: 0 }}
      >
        <View className="flex-row items-end gap-2 bg-white px-4 py-2 dark:bg-black">
          <View className="flex-1 rounded-full bg-zinc-100 px-3 dark:bg-zinc-800">
            <TextInput
              ref={inputRef}
              className="text-lg text-black dark:text-white"
              style={{ minHeight: 44, maxHeight: 144, paddingTop: 10 }}
              placeholder="Message..."
              placeholderTextColor={colorScheme === 'dark' ? '#a1a1aa' : '#71717a'}
              value={inputValue}
              onChangeText={setInputValue}
              multiline
              textAlignVertical="center"
            />
          </View>

          <TouchableOpacity
            className={`h-12 w-12 items-center justify-center rounded-full ${inputValue.trim() ? 'bg-black dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-700'}`}
            onPress={() => {
              handleSend()
              Keyboard.dismiss()
            }}
            disabled={!inputValue.trim()}
          >
            <Text className={`text-xl ${inputValue.trim() ? 'text-white dark:text-black' : 'text-zinc-500'}`}>
              ↑
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <LoginSheet
        visible={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false)
          setShowRegister(true)
        }}
      />

      <RegisterSheet
        visible={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false)
          setShowLogin(true)
        }}
      />
    </Pressable>
  )
}
