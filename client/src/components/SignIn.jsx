import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const normalize = (address) => address?.trim().toLowerCase() || "";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Get connected accounts (without popup)
  const getConnectedAccounts = async () => {
    if (!window.ethereum) throw new Error("MetaMask not installed");
    return await window.ethereum.request({ method: "eth_accounts" });
  };

  // Request accounts (with popup)
  const requestAccountSwitch = async () => {
    if (!window.ethereum) throw new Error("MetaMask not installed");
    return await window.ethereum.request({ method: "eth_requestAccounts" });
  };

  // Validate wallet: check localStorage vs connected wallet
  // If mismatch, trigger MetaMask popup to request accounts, then re-check
  const validateWalletAddress = async (role) => {
    const localStorageWallet = normalize(localStorage.getItem(`walletAddress_${role}`));
    if (!localStorageWallet) {
      toast.info("No registered wallet found in local storage.");
      // Force connect wallet with popup
      const accounts = await requestAccountSwitch();
      if (!accounts || accounts.length === 0) throw new Error("No wallet connected");
      const connectedWallet = normalize(accounts[0]);
      localStorage.setItem(`walletAddress_${role}`, connectedWallet);
      toast.success(`Wallet connected: ${connectedWallet}`);
      return true;
    }

    let accounts = await getConnectedAccounts();
    let connectedWallet = normalize(accounts[0]);

    if (connectedWallet === localStorageWallet) {
      toast.success("Wallet validation successful.");
      return true;
    }

    // Wallet mismatch — ask user to switch wallet in MetaMask by forcing popup
    toast.error(`Wallet mismatch! Please switch MetaMask to registered wallet: ${localStorageWallet}`);

    // Request accounts popup to let user pick correct account
    accounts = await requestAccountSwitch();
    connectedWallet = normalize(accounts[0]);

    if (connectedWallet === localStorageWallet) {
      toast.success(`Wallet switched to registered account: ${connectedWallet}`);
      return true;
    } else {
      throw new Error(`Wallet mismatch after switching. Expected ${localStorageWallet}, got ${connectedWallet}`);
    }
  };

  const handleSignIn = async () => {
    const { email, password, role } = formData;

    if (!email || !password || !role) {
      toast.error("All fields are required");
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Call backend to check user and get registered wallet (we don't compare backend wallet here, only localStorage and connected wallet)
      // But we still call to validate credentials before wallet check.
      // const res = await axios.post("http://localhost:8080/auth/signin", {
      //   email,
      //   password,
      //   role,
      //   walletOnly: true, // just to check wallet on backend side (optional)
      // });

      // Step 2: Validate wallet (compare localStorage wallet and connected wallet)
      await validateWalletAddress(role);

      // Step 3: After wallet validated, proceed with full signin
      const finalRes = await axios.post("http://localhost:8080/auth/signin", {
        email,
        password,
        role,
      });

      localStorage.setItem(role, finalRes.data.token);
      toast.success(finalRes.data.message);

      // Step 4: Redirect based on role
      switch (role) {
        case "HOSPITAL":
          navigate("/HospUserProfile");
          break;
        case "PATIENT":
          navigate("/PatientUserProfile");
          break;
        case "INSURANCE":
          navigate("/InsurenceDetails");
          break;
        case "DEALER":
          navigate("/DeliveredMedicines");
          break;
        case "ADMIN":
          navigate("/AdminDashboard");
          break;
        case "MANUFACTURE":
          navigate("/CreateProduct");
          break;  
        default:
          break;
      }
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || "Sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-black">
      <div className="w-full max-w-md p-6 shadow-2xl rounded-2xl border space-y-4">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign In</h2>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded-lg outline-none"
          disabled={isLoading}
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-2 border rounded-lg outline-none"
          disabled={isLoading}
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg outline-none"
          disabled={isLoading}
        >
          <option value="">Select Role</option>
          {["PATIENT", "HOSPITAL", "INSURANCE", "DEALER", "MANUFACTURE"].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className={`w-full p-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default SignIn;
