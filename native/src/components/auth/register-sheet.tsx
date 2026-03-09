import { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Modal,
	KeyboardAvoidingView,
	Platform,
	Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface RegisterSheetProps {
	visible: boolean;
	onClose: () => void;
	onSwitchToLogin: () => void;
}

export function RegisterSheet({ visible, onClose, onSwitchToLogin }: RegisterSheetProps) {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const handleRegister = () => {
		// TODO: Implement register logic
		console.log('Register:', name, email, password);
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			presentationStyle="overFullScreen"
			onRequestClose={onClose}
		>
			<Pressable
				className="flex-1 bg-black/60"
				onPress={onClose}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					className="flex-1 justify-end"
				>
					<Pressable
						className="rounded-t-3xl bg-[#1a1a1a] p-6"
						onPress={(e) => e.stopPropagation()}
					>
						<SafeAreaView>
							<View className="mb-4 flex-row items-center justify-between">
								<Text className="text-xl font-semibold text-white">
									Sign Up
								</Text>
								<TouchableOpacity onPress={onClose}>
									<Ionicons name="close" size={24} color="#9ca3af" />
								</TouchableOpacity>
							</View>

							<View className="gap-4">
								<View>
									<Text className="mb-2 text-sm text-gray-400">Name</Text>
									<TextInput
										className="rounded-xl bg-[#2a2a2a] px-4 py-3 text-white"
										placeholder="Enter your name"
										placeholderTextColor="#6b7280"
										value={name}
										onChangeText={setName}
										autoCapitalize="words"
									/>
								</View>

								<View>
									<Text className="mb-2 text-sm text-gray-400">Email</Text>
									<TextInput
										className="rounded-xl bg-[#2a2a2a] px-4 py-3 text-white"
										placeholder="Enter your email"
										placeholderTextColor="#6b7280"
										value={email}
										onChangeText={setEmail}
										keyboardType="email-address"
										autoCapitalize="none"
									/>
								</View>

								<View>
									<Text className="mb-2 text-sm text-gray-400">Password</Text>
									<View className="flex-row items-center rounded-xl bg-[#2a2a2a] px-4">
										<TextInput
											className="flex-1 py-3 text-white"
											placeholder="Create a password"
											placeholderTextColor="#6b7280"
											value={password}
											onChangeText={setPassword}
											secureTextEntry={!showPassword}
										/>
										<TouchableOpacity
											onPress={() => setShowPassword(!showPassword)}
										>
											<Ionicons
												name={showPassword ? 'eye-off' : 'eye'}
												size={20}
												color="#9ca3af"
											/>
										</TouchableOpacity>
									</View>
								</View>

								<TouchableOpacity
									className="mt-2 rounded-full bg-white py-4"
									onPress={handleRegister}
								>
									<Text className="text-center font-semibold text-black">
										Create Account
									</Text>
								</TouchableOpacity>

								<View className="mt-4 flex-row items-center justify-center gap-1">
									<Text className="text-gray-400">Already have an account?</Text>
									<TouchableOpacity onPress={onSwitchToLogin}>
										<Text className="font-medium text-white">Sign in</Text>
									</TouchableOpacity>
								</View>
							</View>
						</SafeAreaView>
					</Pressable>
				</KeyboardAvoidingView>
			</Pressable>
		</Modal>
	);
}
