import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const popularCurrencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'INR', name: 'Indian Rupee' },
];

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        // Note: In a real application, you would use an actual API key
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
        );
        const data = await response.json();
        const rate = data.rates[toCurrency];
        setExchangeRate(rate);
        setConvertedAmount(parseFloat(amount) * rate);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      }
    };

    if (fromCurrency && toCurrency) {
      fetchExchangeRate();
    }
  }, [fromCurrency, toCurrency, amount]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Header Section */}
      <header className="space-y-3 sm:space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold">Currency Tools</h1>
        <p className="text-lg sm:text-xl text-muted-foreground">
          Convert between different currencies using real-time exchange rates
        </p>
      </header>

      {/* Main Tools Section */}
      <section>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
            <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Currency Converter
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Convert Currency</CardTitle>
            <CardDescription>Enter amount and select currencies to convert</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="amount" className="text-sm font-medium">
                  Amount
                </label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="0"
                />
              </div>

              <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-end">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">From</label>
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {popularCurrencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSwapCurrencies}
                  className="mb-1"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">To</label>
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {popularCurrencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {convertedAmount !== null && exchangeRate !== null && (
              <div className="pt-4 border-t space-y-2">
                <div className="text-2xl font-bold">
                  {parseFloat(amount).toLocaleString()} {fromCurrency} ={' '}
                  {convertedAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  {toCurrency}
                </div>
                <p className="text-sm text-muted-foreground">
                  1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default CurrencyConverter; 