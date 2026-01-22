import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';
import DateInput from './DateInput';
import RadioGroup from './RadioGroup';
import ResultDisplay from './ResultDisplay';
import './DeadlineCalculator.css';

const DeadlineCalculator = () => {
  // Flowchart state
  const [courtType, setCourtType] = useState('');
  const [commercialCourtType, setCommercialCourtType] = useState('');
  const [isAdmiraltyRem, setIsAdmiraltyRem] = useState(null);
  
  // Dates
  const [claimFormIssued, setClaimFormIssued] = useState('');
  const [claimFormServed, setClaimFormServed] = useState('');
  const [acknowledgmentFiled, setAcknowledgmentFiled] = useState('');
  const [servedWithinEngland, setServedWithinEngland] = useState(null);
  
  // Result
  const [deadline, setDeadline] = useState(null);
  const [calculationDetails, setCalculationDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if all required fields are filled for current path
  const canCalculate = () => {
    if (courtType === 'no') {
      return claimFormIssued && claimFormServed && servedWithinEngland !== null;
    } else if (courtType === 'yes') {
      if (commercialCourtType === 'commercial' || commercialCourtType === 'circuit') {
        return acknowledgmentFiled;
      } else if (commercialCourtType === 'admiralty') {
        if (isAdmiraltyRem === true) {
          return claimFormServed;
        } else if (isAdmiraltyRem === false) {
          return acknowledgmentFiled;
        }
      }
    }
    return false;
  };

  // Calculate deadline via serverless function API
  const calculateDeadline = async () => {
    if (!canCalculate()) {
      setDeadline(null);
      setCalculationDetails('');
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/calculate-deadline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courtType,
          commercialCourtType,
          isAdmiraltyRem,
          claimFormIssued,
          claimFormServed,
          acknowledgmentFiled,
          servedWithinEngland
        }),
      });

      const data = await response.json();

      if (data.success) {
        setDeadline(new Date(data.deadline));
        setCalculationDetails(data.calculationDetails);
      } else {
        setError(data.error || 'Failed to calculate deadline');
        setDeadline(null);
        setCalculationDetails('');
      }
    } catch (err) {
      setError('Error connecting to serverless function. Please try again.');
      setDeadline(null);
      setCalculationDetails('');
      console.error('Calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate deadline when relevant fields change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      calculateDeadline();
    }, 300); // Debounce API calls

    return () => clearTimeout(timeoutId);
  }, [
    courtType,
    commercialCourtType,
    isAdmiraltyRem,
    claimFormIssued,
    claimFormServed,
    acknowledgmentFiled,
    servedWithinEngland
  ]);

  const resetForm = () => {
    setCourtType('');
    setCommercialCourtType('');
    setIsAdmiraltyRem(null);
    setClaimFormIssued('');
    setClaimFormServed('');
    setAcknowledgmentFiled('');
    setServedWithinEngland(null);
    setDeadline(null);
    setCalculationDetails('');
  };

  return (
    <div className="deadline-calculator">
      <div className="calculator-header">
        <h1>Deadline to Serve Particulars of Claim</h1>
        <p className="subtitle">(if served separately from the Claim Form)</p>
      </div>

      <div className="calculator-content">
        {/* Question 1: Court Type */}
        <QuestionCard question="1. Is the claim in the Commercial Court, Circuit Commercial Court or Admiralty Court?" required>
          <RadioGroup
            name="courtType"
            value={courtType}
            onChange={setCourtType}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' }
            ]}
          />
        </QuestionCard>

        {/* Standard Court Path (No) */}
        {courtType === 'no' && (
          <>
            <QuestionCard question="2A. When is the Claim Form issued?" required>
              <DateInput
                label="Claim Form Issued Date"
                value={claimFormIssued}
                onChange={setClaimFormIssued}
                required
              />
            </QuestionCard>

            <QuestionCard question="3A. Is the Claim Form served within or outside England?" required>
              <RadioGroup
                name="servedLocation"
                value={servedWithinEngland === true ? 'within' : servedWithinEngland === false ? 'outside' : ''}
                onChange={(value) => setServedWithinEngland(value === 'within')}
                options={[
                  { value: 'within', label: 'Within England' },
                  { value: 'outside', label: 'Outside England' }
                ]}
              />
            </QuestionCard>

            <QuestionCard question="4A. When is the Claim Form served on the defendant?" required>
              <DateInput
                label="Claim Form Served Date"
                value={claimFormServed}
                onChange={setClaimFormServed}
                required
                helpText="Date posted (first class post), delivered, left at address, or transmission completed (fax/email)"
              />
            </QuestionCard>
          </>
        )}

        {/* Commercial/Circuit Commercial/Admiralty Court Path (Yes) */}
        {courtType === 'yes' && (
          <>
            <QuestionCard question="2. Which court?" required>
              <RadioGroup
                name="commercialCourtType"
                value={commercialCourtType}
                onChange={setCommercialCourtType}
                options={[
                  { value: 'commercial', label: 'Commercial Court' },
                  { value: 'circuit', label: 'Circuit Commercial Court' },
                  { value: 'admiralty', label: 'Admiralty Court' }
                ]}
              />
            </QuestionCard>

            {/* Commercial Court or Circuit Commercial Court */}
            {(commercialCourtType === 'commercial' || commercialCourtType === 'circuit') && (
              <QuestionCard question="2B. When is the Acknowledgment of Service (which indicates an intention to defend) filed by the defendant?" required>
                <DateInput
                  label="Acknowledgment of Service Filed Date"
                  value={acknowledgmentFiled}
                  onChange={setAcknowledgmentFiled}
                  required
                />
              </QuestionCard>
            )}

            {/* Admiralty Court */}
            {commercialCourtType === 'admiralty' && (
              <>
                <QuestionCard question="2C. Is the claim a claim in rem?" required>
                  <RadioGroup
                    name="isAdmiraltyRem"
                    value={isAdmiraltyRem === true ? 'yes' : isAdmiraltyRem === false ? 'no' : ''}
                    onChange={(value) => setIsAdmiraltyRem(value === 'yes')}
                    options={[
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' }
                    ]}
                  />
                </QuestionCard>

                {isAdmiraltyRem === true && (
                  <QuestionCard question="2C(i). When is the Claim Form served on the defendant?" required>
                    <DateInput
                      label="Claim Form Served Date"
                      value={claimFormServed}
                      onChange={setClaimFormServed}
                      required
                      helpText="Date posted (first class post), delivered, left at address, or transmission completed (fax/email)"
                    />
                  </QuestionCard>
                )}

                {isAdmiraltyRem === false && (
                  <QuestionCard question="2C(ii). When is the Acknowledgment of Service (which indicates an intention to defend) filed by the defendant?" required>
                    <DateInput
                      label="Acknowledgment of Service Filed Date"
                      value={acknowledgmentFiled}
                      onChange={setAcknowledgmentFiled}
                      required
                    />
                  </QuestionCard>
                )}
              </>
            )}
          </>
        )}

        {/* Error Display */}
        {error && (
          <div className="error-display">
            <p className="error-message">⚠️ {error}</p>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="loading-display">
            <p>Calculating deadline...</p>
          </div>
        )}

        {/* Result Display */}
        {deadline && !loading && (
          <ResultDisplay deadline={deadline} calculationDetails={calculationDetails} />
        )}

        {/* Reset Button */}
        {(courtType || deadline) && (
          <div className="reset-container">
            <button className="reset-button" onClick={resetForm}>
              Reset Calculator
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeadlineCalculator;
