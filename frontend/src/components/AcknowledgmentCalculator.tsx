import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';
import DateInput from './DateInput';
import RadioGroup from './RadioGroup';
import ResultDisplay from './ResultDisplay';
import LoadingBar from './LoadingBar';
import FAQ from './FAQ';
import {
  calculateStandardDefenceDeadline,
  calculateJudgmentByDefaultDeadline,
  calculateDefenceDeadlineWithExtension,
  formatDateForInput,
  addDays
} from '../utils/acknowledgmentCalculations';
import './DeadlineCalculator.css';

interface AcknowledgmentResult {
  type: 'defence' | 'judgment';
  deadline: Date;
  details: string;
}

const AcknowledgmentCalculator: React.FC = () => {
  // Main inputs
  const [datedos, setDatedos] = useState<string>('');
  const [hasFiledAoS, setHasFiledAoS] = useState<boolean | null>(null);
  const [aosFiledDate, setAosFiledDate] = useState<string>('');

  // Judgment by default path (NO to AoS)
  const [hasAppliedForJudgment, setHasAppliedForJudgment] = useState<boolean | null>(null);
  const [judgmentApplicationSuccessful, setJudgmentApplicationSuccessful] = useState<boolean | null>(null);
  const [hasServedDefence, setHasServedDefence] = useState<boolean | null>(null);

  // Scenario conditions (YES to AoS)
  const [statementOfCaseServed, setStatementOfCaseServed] = useState<boolean | null>(null);
  const [cpr1541bApplies, setCpr1541bApplies] = useState<boolean | null>(null);
  const [agreementToExtend, setAgreementToExtend] = useState<boolean | null>(null);
  const [applicationToExtend, setApplicationToExtend] = useState<boolean | null>(null);
  const [extensionDays, setExtensionDays] = useState<string>('');
  const [cpr1542Applies, setCpr1542Applies] = useState<boolean | null>(null);
  const [courtOrderExtension, setCourtOrderExtension] = useState<boolean | null>(null);
  const [courtOrderExtensionDays, setCourtOrderExtensionDays] = useState<string>('');
  const [cpr1541aApplies, setCpr1541aApplies] = useState<boolean | null>(null);
  const [proposedSettlementDate, setProposedSettlementDate] = useState<string>('');

  // Result
  const [result, setResult] = useState<AcknowledgmentResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate result based on flowchart logic
  const calculateResult = (): void => {
    if (!datedos) {
      setResult(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const datedosDate = new Date(datedos);
      let calculatedResult: AcknowledgmentResult | null = null;

      // First decision: Has D filed an Acknowledgment of Service?
      if (hasFiledAoS === false) {
        // NO Path - Judgment by default logic
        if (hasAppliedForJudgment === false) {
          if (hasServedDefence === false) {
            const deadline = calculateJudgmentByDefaultDeadline(datedosDate);
            calculatedResult = {
              type: 'judgment',
              deadline,
              details: `P may apply for judgment by default. Deadline: ${formatDateForInput(datedosDate)} + 14 days = ${formatDateForInput(deadline)}.`
            };
          } else {
            calculatedResult = {
              type: 'judgment',
              deadline: datedosDate,
              details: 'P cannot apply for judgment by default (D has served their defence).'
            };
          }
        } else if (hasAppliedForJudgment === true) {
          if (judgmentApplicationSuccessful === false) {
            const deadline = calculateJudgmentByDefaultDeadline(datedosDate);
            calculatedResult = {
              type: 'judgment',
              deadline,
              details: `P may apply for judgment by default. Deadline: ${formatDateForInput(datedosDate)} + 14 days = ${formatDateForInput(deadline)}.`
            };
          } else {
            calculatedResult = {
              type: 'judgment',
              deadline: datedosDate,
              details: 'P cannot apply for judgment by default (D\'s application was successful).'
            };
          }
        }
      } else if (hasFiledAoS === true) {
        // YES Path - Defence deadline calculations
        let deadline = calculateStandardDefenceDeadline(datedosDate);
        let details = `Standard deadline: ${formatDateForInput(datedosDate)} + 28 days = ${formatDateForInput(deadline)}.`;

        // Check for extensions
        if (agreementToExtend === true && extensionDays) {
          const extDays = parseInt(extensionDays);
          if (!isNaN(extDays) && extDays > 0) {
            deadline = calculateDefenceDeadlineWithExtension(datedosDate, extDays);
            details = `Standard deadline: ${formatDateForInput(datedosDate)} + 28 days = ${formatDateForInput(calculateStandardDefenceDeadline(datedosDate))}, plus extension of ${extDays} days (max 28 days) = ${formatDateForInput(deadline)}.`;
          }
        }

        if (applicationToExtend === true && extensionDays) {
          const extDays = parseInt(extensionDays);
          if (!isNaN(extDays) && extDays > 0) {
            deadline = calculateDefenceDeadlineWithExtension(datedosDate, extDays);
            details = `Standard deadline: ${formatDateForInput(datedosDate)} + 28 days = ${formatDateForInput(calculateStandardDefenceDeadline(datedosDate))}, plus extension of ${extDays} days (max 28 days) = ${formatDateForInput(deadline)}.`;
          }
        }

        if (courtOrderExtension === true && courtOrderExtensionDays) {
          const extDays = parseInt(courtOrderExtensionDays);
          if (!isNaN(extDays) && extDays > 0) {
            deadline = addDays(deadline, extDays);
            details += ` Plus court order extension of ${extDays} days = ${formatDateForInput(deadline)}.`;
          }
        }

        // Add scenario-specific notes
        if (statementOfCaseServed === true) {
          details += ' Statement of case has been served.';
        }
        if (cpr1541bApplies === true) {
          details += ' CPR 15.4(1)(b) applies (Particulars served separately).';
        }
        if (cpr1542Applies === true) {
          details += ' CPR 15.4(2) applies (D has applied to strike out/summary judgment).';
        }
        if (cpr1541aApplies === true) {
          details += ' CPR 15.4(1)(a) applies (Particulars served with Claim Form).';
        }

        calculatedResult = {
          type: 'defence',
          deadline,
          details: `D must serve defence by ${formatDateForInput(deadline)}. ${details}`
        };
      }

      setResult(calculatedResult);
    } catch (err) {
      setError('Error calculating deadline. Please check your inputs.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      calculateResult();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    datedos,
    hasFiledAoS,
    aosFiledDate,
    hasAppliedForJudgment,
    judgmentApplicationSuccessful,
    hasServedDefence,
    statementOfCaseServed,
    cpr1541bApplies,
    agreementToExtend,
    applicationToExtend,
    extensionDays,
    cpr1542Applies,
    courtOrderExtension,
    courtOrderExtensionDays,
    cpr1541aApplies,
    proposedSettlementDate
  ]);

  const resetForm = (): void => {
    setDatedos('');
    setHasFiledAoS(null);
    setAosFiledDate('');
    setHasAppliedForJudgment(null);
    setJudgmentApplicationSuccessful(null);
    setHasServedDefence(null);
    setStatementOfCaseServed(null);
    setCpr1541bApplies(null);
    setAgreementToExtend(null);
    setApplicationToExtend(null);
    setExtensionDays('');
    setCpr1542Applies(null);
    setCourtOrderExtension(null);
    setCourtOrderExtensionDays('');
    setCpr1541aApplies(null);
    setProposedSettlementDate('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="deadline-calculator">
      <div className="calculator-header">
        <h1>Acknowledgment of Service Calculator</h1>
        <p className="subtitle">Calculate deadlines for serving defence and judgment by default</p>
      </div>

      <div className="calculator-content">
        {/* Main Input */}
        <QuestionCard question="Date of deemed service (DATEDOS)" required>
          <DateInput
            label="Date of Deemed Service"
            value={datedos}
            onChange={setDatedos}
            required
            helpText="The date when the claim form is deemed to have been served"
          />
        </QuestionCard>

        {/* First Decision Point */}
        <QuestionCard question="Has D filed an Acknowledgment of Service?" required>
          <RadioGroup
            name="hasFiledAoS"
            value={hasFiledAoS === true ? 'yes' : hasFiledAoS === false ? 'no' : ''}
            onChange={(value) => setHasFiledAoS(value === 'yes')}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' }
            ]}
          />
        </QuestionCard>

        {/* NO Path - Judgment by Default */}
        {hasFiledAoS === false && (
          <>
            <QuestionCard question="Has D applied for judgment by default?" required>
              <RadioGroup
                name="hasAppliedForJudgment"
                value={hasAppliedForJudgment === true ? 'yes' : hasAppliedForJudgment === false ? 'no' : ''}
                onChange={(value) => setHasAppliedForJudgment(value === 'yes')}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' }
                ]}
              />
            </QuestionCard>

            {hasAppliedForJudgment === false && (
              <QuestionCard question="Has D served their defence?" required>
                <RadioGroup
                  name="hasServedDefence"
                  value={hasServedDefence === true ? 'yes' : hasServedDefence === false ? 'no' : ''}
                  onChange={(value) => setHasServedDefence(value === 'yes')}
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' }
                  ]}
                />
              </QuestionCard>
            )}

            {hasAppliedForJudgment === true && (
              <QuestionCard question="Was D's application for judgment by default successful?" required>
                <RadioGroup
                  name="judgmentApplicationSuccessful"
                  value={judgmentApplicationSuccessful === true ? 'yes' : judgmentApplicationSuccessful === false ? 'no' : ''}
                  onChange={(value) => setJudgmentApplicationSuccessful(value === 'yes')}
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' }
                  ]}
                />
              </QuestionCard>
            )}
          </>
        )}

        {/* YES Path - Defence Deadline Calculations */}
        {hasFiledAoS === true && (
          <>
            <QuestionCard question="When was Acknowledgment of Service filed?">
              <DateInput
                label="AoS Filed Date"
                value={aosFiledDate}
                onChange={setAosFiledDate}
                helpText="Optional: Date when Acknowledgment of Service was filed"
              />
            </QuestionCard>

            {/* Scenario Questions */}
            <QuestionCard question="Statement of case has been served?">
              <RadioGroup
                name="statementOfCaseServed"
                value={statementOfCaseServed === true ? 'yes' : statementOfCaseServed === false ? 'no' : ''}
                onChange={(value) => setStatementOfCaseServed(value === 'yes' ? true : value === 'no' ? false : null)}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                  { value: 'na', label: 'Not Applicable' }
                ]}
              />
            </QuestionCard>

            <QuestionCard question="CPR 15.4(1)(b) applies? (Particulars served separately)">
              <RadioGroup
                name="cpr1541bApplies"
                value={cpr1541bApplies === true ? 'yes' : cpr1541bApplies === false ? 'no' : ''}
                onChange={(value) => setCpr1541bApplies(value === 'yes' ? true : value === 'no' ? false : null)}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                  { value: 'na', label: 'Not Applicable' }
                ]}
              />
            </QuestionCard>

            <QuestionCard question="CPR 15.4(1)(a) applies? (Particulars served with Claim Form)">
              <RadioGroup
                name="cpr1541aApplies"
                value={cpr1541aApplies === true ? 'yes' : cpr1541aApplies === false ? 'no' : ''}
                onChange={(value) => setCpr1541aApplies(value === 'yes' ? true : value === 'no' ? false : null)}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                  { value: 'na', label: 'Not Applicable' }
                ]}
              />
            </QuestionCard>

            <QuestionCard question="CPR 15.4(2) applies? (D has applied to strike out/summary judgment)">
              <RadioGroup
                name="cpr1542Applies"
                value={cpr1542Applies === true ? 'yes' : cpr1542Applies === false ? 'no' : ''}
                onChange={(value) => setCpr1542Applies(value === 'yes' ? true : value === 'no' ? false : null)}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                  { value: 'na', label: 'Not Applicable' }
                ]}
              />
            </QuestionCard>

            <QuestionCard question="Agreement to extend time for service of defence?">
              <RadioGroup
                name="agreementToExtend"
                value={agreementToExtend === true ? 'yes' : agreementToExtend === false ? 'no' : ''}
                onChange={(value) => setAgreementToExtend(value === 'yes' ? true : value === 'no' ? false : null)}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                  { value: 'na', label: 'Not Applicable' }
                ]}
              />
            </QuestionCard>

            {agreementToExtend === true && (
              <QuestionCard question="Extension period (days, max 28 days)">
                <div className="date-input-group">
                  <label className="date-input-label">
                    Extension Days (1-28)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="28"
                    value={extensionDays}
                    onChange={(e) => setExtensionDays(e.target.value)}
                    className="date-input"
                    placeholder="Enter days (1-28)"
                  />
                  <p className="date-input-help">Maximum extension period is 28 days</p>
                </div>
              </QuestionCard>
            )}

            <QuestionCard question="Application to extend time for service of defence?">
              <RadioGroup
                name="applicationToExtend"
                value={applicationToExtend === true ? 'yes' : applicationToExtend === false ? 'no' : ''}
                onChange={(value) => setApplicationToExtend(value === 'yes' ? true : value === 'no' ? false : null)}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                  { value: 'na', label: 'Not Applicable' }
                ]}
              />
            </QuestionCard>

            {applicationToExtend === true && (
              <QuestionCard question="Extension period (days, max 28 days)">
                <div className="date-input-group">
                  <label className="date-input-label">
                    Extension Days (1-28)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="28"
                    value={extensionDays}
                    onChange={(e) => setExtensionDays(e.target.value)}
                    className="date-input"
                    placeholder="Enter days (1-28)"
                  />
                  <p className="date-input-help">Maximum extension period is 28 days</p>
                </div>
              </QuestionCard>
            )}

            <QuestionCard question="Further extension from court order?">
              <RadioGroup
                name="courtOrderExtension"
                value={courtOrderExtension === true ? 'yes' : courtOrderExtension === false ? 'no' : ''}
                onChange={(value) => setCourtOrderExtension(value === 'yes' ? true : value === 'no' ? false : null)}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                  { value: 'na', label: 'Not Applicable' }
                ]}
              />
            </QuestionCard>

            {courtOrderExtension === true && (
              <QuestionCard question="Court order extension period (days)">
                <div className="date-input-group">
                  <label className="date-input-label">
                    Court Order Extension Days
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={courtOrderExtensionDays}
                    onChange={(e) => setCourtOrderExtensionDays(e.target.value)}
                    className="date-input"
                    placeholder="Enter days"
                  />
                </div>
              </QuestionCard>
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
        {loading && <LoadingBar />}

        {/* Result Display */}
        {result && !loading && (
          <ResultDisplay 
            deadline={result.deadline} 
            calculationDetails={result.details}
          />
        )}

        {/* Reset Button */}
        {(datedos || result) && (
          <div className="reset-container">
            <button className="reset-button" onClick={resetForm}>
              Reset Calculator
            </button>
          </div>
        )}

        {/* FAQ Section */}
        <FAQ />
      </div>
    </div>
  );
};

export default AcknowledgmentCalculator;
