import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLoader } from "@/context/LoaderContext";
import { useGlobalToast } from "@/context/ToastContext";
import LoginImage from "../../assets/Login/LoginBG.png";
import CompanyLogo from "@/SVG/CompanyLogo";
import TextToSpeechPlayer from "@/features/GetAISoundFromText/Index";
import { playTextToSpeech } from "@/features/GetAISoundFromText/GetAIText";

// ✅ Validation Schema
const validationSchema = yup.object({
    email: yup.string().email("Invalid email address").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    remember: yup.boolean(),
});

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login, user } = useAuth();
    const Token = Cookies.get("token");
    const { showLoader, hideLoader } = useLoader();
    const { showToast } = useGlobalToast();
    console.log(user);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            remember: false,
        },
        validationSchema,
        onSubmit: async (values) => {
            showLoader();

            try {
                const result = await login(values.email, values.password);

                if (result?.token) {
                    if (values.remember) {
                        Cookies.set("email", values.email, { expires: 30, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
                        Cookies.set("password", values.password, { expires: 30, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
                    } else {
                        Cookies.remove("email");
                        Cookies.remove("password");
                    }
                    if (result?.data?.role !== "Admin") {
                        showToast("Investors are not allowed to log in!", "error");
                        navigate("/");
                        return
                    } else {
                        showToast("Login successful!", "success");
                        navigate("/dashboard");
                    }
                    // ✅ Play AI-generated voice after successful login
                    const audioUrl = await playTextToSpeech("Login successful! Welcome to your Amazon JV dashboard.");
                    if (audioUrl) {
                        const audio = new Audio(audioUrl);
                        audio.play();
                    }
                } else {
                    showToast(result.error || "Invalid login credentials", "error");
                }
            } catch (error) {
                showToast(error.message || "Network error. Please try again.", "error");
                // ✅ Play AI-generated voice after successful login
                const audioUrl = await playTextToSpeech(error.message);
                if (audioUrl) {
                    const audio = new Audio(audioUrl);
                    audio.play();
                }
            } finally {
                hideLoader();
            }
        },
    });

    // ✅ Auto-fill credentials if saved in cookies
    useEffect(() => {
        const savedEmail = Cookies.get("email");
        const savedPassword = Cookies.get("password");

        if (savedEmail && savedPassword) {
            formik.setFieldValue("email", savedEmail);
            formik.setFieldValue("password", savedPassword);
            formik.setFieldValue("remember", true);
        }
    }, []);

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-100 items-center justify-center p-6 md:p-0"
            style={{
                backgroundImage: `url(${LoginImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="w-full md:w-1/2 flex flex-col gap-4 items-center justify-center md:p-10">
                <div className="flex items-center gap-2">
                    <CompanyLogo width="60" height="60" />
                    <h1 className="text-3xl md:text-5xl font-bold text-[#0071E4]">
                        Amazon <span className="text-[#000000]">JV</span>
                    </h1>
                </div>


                <Card className="w-full max-w-md p-6 h-[100%] shadow-lg bg-white">
                    <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>
                    <p className="text-gray-500 text-center mb-6">Welcome Back! Please enter your details.</p>
                    <CardContent>
                        <form onSubmit={formik.handleSubmit}>
                            {/* Email Field */}
                            <div className="mb-4">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="mb-4">
                                <Label>Password</Label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        name="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-500"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {formik.touched.password && formik.errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                                )}
                            </div>

                            {/* Remember Me Checkbox */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={formik.values.remember}
                                        onChange={(e) => formik.setFieldValue("remember", e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                    <span>Remember Password</span>
                                </div>
                                <a href="#" className="text-blue-500 text-sm">Forgot Password?</a>
                            </div>

                            {/* Submit Button */}
                            <Button className="w-full bg-blue-500 text-white" type="submit">Sign In</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
