import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Heading from "../../components/ui/Heading.jsx";
import Text from "../../components/ui/Text.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import TransferSuccessModal from "../../components/TransferFunds/TransferSuccessModal.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { addTransaction } from "../../lib/transactions.js";
import { notifyError } from "../../lib/toast.js";
import { formatCurrency } from "../../lib/format.js";
import { getUserProfile, updateUserProfile } from "../../lib/userProfile.js";

const transferSchema = yup.object({
  name: yup.string().trim().required("Recipient's account name is required"),
  accountNumber: yup
    .string()
    .trim()
    .required("Account number is required")
    .matches(/^\d{10}$/, "Enter a valid 10-digit account number"),
  bankName: yup.string().trim().required("Bank name is required"),
  switchCode: yup.string().trim().required("Switch code is required"),
  ibmNumber: yup.string().trim().required("IBM number is required"),
  country: yup.string().trim().required("Country is required"),
  amount: yup
    .number()
    .typeError("Enter a valid amount")
    .positive("Amount must be greater than 0")
    .required("Amount is required"),
});

function TransferFunds() {
  const { user } = useAuth();
  const [successfulTransfer, setSuccessfulTransfer] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(transferSchema),
    defaultValues: {
      name: "",
      accountNumber: "",
      bankName: "",
      switchCode: "",
      ibmNumber: "",
      country: "",
      amount: "",
    },
  });

  async function onSubmit(data) {
    if (Number(data.amount) > Number(user?.balance ?? 0)) {
      notifyError(null, "Insufficient funds for this transfer.");
      return;
    }

    try {
      const profile = await getUserProfile(user.uid);
      const currentBalance = Number(profile?.balance) || 0;
      const transferAmount = Math.abs(Number(data.amount));
      const newBalance = currentBalance - transferAmount;

      await addTransaction(user.uid, {
        description: `Transfer to ${data.name}`,
        amount: -transferAmount,
        balance: newBalance,
      });

      await updateUserProfile(user.uid, { balance: newBalance });
      setSuccessfulTransfer(data);
      reset();
    } catch (err) {
      notifyError(err, "Could not complete this transfer.");
    }
  }

  function handleSuccessModalClose() {
    setSuccessfulTransfer(null);
    reset();
  }

  return (
    <div className="max-w-2xl">
      <Heading level={1} size="md">
        Transfer Funds
      </Heading>
      <Text variant="body" className="mt-2">
        Enter the recipient details and amount to transfer funds instantly.
      </Text>
      <Text variant="small" className="mt-1">
        Available balance: {user?.currency || "USD"}{" "}
        {formatCurrency(user?.balance)}
      </Text>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-5 p-6 mt-8 border rounded-lg border-text-secondary/15 bg-surface"
      >
        <Input
          label="Account Name*"
          placeholder="Recipient's account name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Account Number*"
          placeholder="Recipient's account number"
          error={errors.accountNumber?.message}
          {...register("accountNumber")}
        />
        <Input
          label="Bank Name*"
          placeholder="Recipient's bank name"
          error={errors.bankName?.message}
          {...register("bankName")}
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Switch Code*"
            placeholder="e.g. VBNKUS33"
            error={errors.switchCode?.message}
            {...register("switchCode")}
          />
          <Input
            label="IBM Number*"
            placeholder="e.g. GB29NWBK60161331926819"
            error={errors.ibmNumber?.message}
            {...register("ibmNumber")}
          />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Country*"
            placeholder="Recipient's country"
            error={errors.country?.message}
            {...register("country")}
          />
          <Input
            label="Amount*"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            error={errors.amount?.message}
            {...register("amount")}
          />
        </div>

        <Button type="submit" loading={isSubmitting} className="self-start">
          Continue
        </Button>
      </form>

      <TransferSuccessModal
        open={!!successfulTransfer}
        onClose={handleSuccessModalClose}
        transferDetails={successfulTransfer}
        currency={user?.currency || 'NGN'}
      />
    </div>
  );
}

export default TransferFunds;
