import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const unitTypes = {
  length: {
    name: 'Length',
    units: {
      km: { name: 'Kilometers', toBase: (v: number) => v * 1000 },
      m: { name: 'Meters', toBase: (v: number) => v },
      cm: { name: 'Centimeters', toBase: (v: number) => v / 100 },
      mm: { name: 'Millimeters', toBase: (v: number) => v / 1000 },
      mi: { name: 'Miles', toBase: (v: number) => v * 1609.344 },
      yd: { name: 'Yards', toBase: (v: number) => v * 0.9144 },
      ft: { name: 'Feet', toBase: (v: number) => v * 0.3048 },
      in: { name: 'Inches', toBase: (v: number) => v * 0.0254 },
    },
  },
  weight: {
    name: 'Weight',
    units: {
      kg: { name: 'Kilograms', toBase: (v: number) => v * 1000 },
      g: { name: 'Grams', toBase: (v: number) => v },
      mg: { name: 'Milligrams', toBase: (v: number) => v / 1000 },
      lb: { name: 'Pounds', toBase: (v: number) => v * 453.592 },
      oz: { name: 'Ounces', toBase: (v: number) => v * 28.3495 },
    },
  },
  temperature: {
    name: 'Temperature',
    units: {
      c: {
        name: 'Celsius',
        toBase: (v: number) => v,
        fromBase: (v: number) => v,
      },
      f: {
        name: 'Fahrenheit',
        toBase: (v: number) => ((v - 32) * 5) / 9,
        fromBase: (v: number) => (v * 9) / 5 + 32,
      },
      k: {
        name: 'Kelvin',
        toBase: (v: number) => v - 273.15,
        fromBase: (v: number) => v + 273.15,
      },
    },
  },
};

const UnitConverter = () => {
  const [unitType, setUnitType] = useState<keyof typeof unitTypes>('length');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('km');
  const [value, setValue] = useState<string>('1');
  const [result, setResult] = useState<number | null>(null);

  const convert = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setResult(null);
      return;
    }

    const units = unitTypes[unitType].units;
    if (unitType === 'temperature') {
      // Special handling for temperature
      const baseValue = units[fromUnit].toBase(numValue);
      setResult(units[toUnit].fromBase(baseValue));
    } else {
      // For length and weight
      const baseValue = units[fromUnit].toBase(numValue);
      const toBaseUnit = units[toUnit].toBase(1);
      setResult(baseValue / toBaseUnit);
    }
  };

  useEffect(() => {
    convert();
  }, [value, fromUnit, toUnit, unitType]);

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Header Section */}
      <header className="space-y-3 sm:space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold">Unit Tools</h1>
        <p className="text-lg sm:text-xl text-muted-foreground">
          Convert between different units of measurement
        </p>
      </header>

      {/* Main Tools Section */}
      <section>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
            <Ruler className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Unit Converter
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Convert Units</CardTitle>
            <CardDescription>Select unit type and enter value to convert</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={unitType} onValueChange={(v) => setUnitType(v as keyof typeof unitTypes)}>
              <TabsList className="grid w-full grid-cols-3">
                {Object.entries(unitTypes).map(([key, { name }]) => (
                  <TabsTrigger key={key} value={key}>
                    {name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="value" className="text-sm font-medium">
                  Value
                </label>
                <Input
                  id="value"
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter value"
                />
              </div>

              <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-end">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">From</label>
                  <Select value={fromUnit} onValueChange={setFromUnit}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(unitTypes[unitType].units).map(([key, { name }]) => (
                        <SelectItem key={key} value={key}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSwapUnits}
                  className="mb-1"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">To</label>
                  <Select value={toUnit} onValueChange={setToUnit}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(unitTypes[unitType].units).map(([key, { name }]) => (
                        <SelectItem key={key} value={key}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {result !== null && (
              <div className="pt-4 border-t">
                <div className="text-2xl font-bold">
                  {parseFloat(value).toLocaleString()} {unitTypes[unitType].units[fromUnit].name} ={' '}
                  {result.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4,
                  })}{' '}
                  {unitTypes[unitType].units[toUnit].name}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default UnitConverter; 