import { useState } from "react";
import { motion } from "motion/react";
import { X, Download, Search, Filter, Users, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface FormSubmission {
  id: string;
  timestamp: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  roleTypes: string[];
  creativeWork: string;
  segments: string[];
  artistQuestions: {
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    q5: string;
  };
  communityQuestions: {
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    q5: string;
  };
  productFeedbackSurvey: string;
  resonanceLevel: string;
  resonanceReasons: string[];
  communitySelections: string[];
}

interface AdminDashboardProps {
  submissions: FormSubmission[];
  onClose: () => void;
}

export function AdminDashboard({ submissions, onClose }: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSegment, setFilterSegment] = useState<string>("all");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      searchQuery === "" ||
      submission.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSegment =
      filterSegment === "all" ||
      submission.segments.includes(filterSegment);

    return matchesSearch && matchesSegment;
  });

  const exportToCSV = () => {
    // CSV headers
    const headers = [
      "Timestamp",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Location",
      "Role Types",
      "Creative Work",
      "Segments",
      "Artist Q1", "Artist Q2", "Artist Q3", "Artist Q4", "Artist Q5",
      "Community Q1", "Community Q2", "Community Q3", "Community Q4", "Community Q5",
      "Product Feedback Survey",
      "Resonance Level",
      "Resonance Reasons",
      "Beta Communities"
    ];

    // CSV rows
    const rows = submissions.map((sub) => [
      sub.timestamp,
      sub.firstName,
      sub.lastName,
      sub.email,
      sub.phone,
      sub.location,
      sub.roleTypes.join("; "),
      `"${sub.creativeWork.replace(/"/g, '""')}"`,
      sub.segments.join("; "),
      sub.artistQuestions.q1,
      sub.artistQuestions.q2,
      sub.artistQuestions.q3,
      sub.artistQuestions.q4,
      sub.artistQuestions.q5,
      sub.communityQuestions.q1,
      sub.communityQuestions.q2,
      sub.communityQuestions.q3,
      sub.communityQuestions.q4,
      sub.communityQuestions.q5,
      sub.productFeedbackSurvey,
      sub.resonanceLevel,
      sub.resonanceReasons.join("; "),
      sub.communitySelections.join("; ")
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Create download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `kyozo-waitlist-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAgreementLabel = (value: string) => {
    const labels: Record<string, string> = {
      "strongly-disagree": "Strongly Disagree",
      "disagree": "Disagree",
      "neutral": "Neutral",
      "agree": "Agree",
      "strongly-agree": "Strongly Agree"
    };
    return labels[value] || value;
  };

  const getResonanceLevelLabel = (value: string) => {
    const labels: Record<string, string> = {
      "1": "1 - Curious",
      "2": "2 - Intrigued",
      "3": "3 - Excited",
      "4": "4 - Eager",
      "5": "5 - Essential"
    };
    return labels[value] || value;
  };

  const getResonanceReasonLabel = (value: string) => {
    const labels: Record<string, string> = {
      "control": "Control over creative work",
      "relationships": "Authentic relationships",
      "safe-space": "Safe creative space",
      "community-tools": "Community tools",
      "freedom": "Freedom from platform pressures",
      "long-term": "Long-term creative flourishing",
      "all": "All of the above"
    };
    return labels[value] || value;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[var(--kyozo-primary)] to-[var(--kyozo-secondary)] text-white p-6 z-10 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8" />
                <div>
                  <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                  <p className="text-white/80 text-sm">Kyozo Waitlist Submissions</p>
                </div>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-white/70 text-sm">Total Submissions</p>
                <p className="text-3xl font-bold">{submissions.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-white/70 text-sm">Artists / Creatives</p>
                <p className="text-3xl font-bold">
                  {submissions.filter(s => s.segments.includes("artist")).length}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-white/70 text-sm">Community Leaders</p>
                <p className="text-3xl font-bold">
                  {submissions.filter(s => s.segments.includes("community")).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="p-6 border-b bg-white shadow-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterSegment} onValueChange={setFilterSegment}>
                  <SelectTrigger className="w-[200px] h-12">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Segments</SelectItem>
                    <SelectItem value="artist">Artists / Creatives</SelectItem>
                    <SelectItem value="community">Community Leaders</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={exportToCSV}
                  className="bg-[var(--kyozo-teal)] hover:opacity-90 h-12"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Showing {filteredSubmissions.length} of {submissions.length} submissions
            </p>
          </div>
        </div>

        {/* Submissions List */}
        <div className="p-6 max-w-7xl mx-auto">
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-xl text-muted-foreground">No submissions found</p>
              <p className="text-sm text-muted-foreground mt-2">
                {submissions.length === 0
                  ? "Submissions will appear here once users complete the waitlist form"
                  : "Try adjusting your search or filter criteria"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Summary Row */}
                  <div
                    className="p-4 bg-white cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleRowExpansion(submission.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Name</p>
                          <p className="font-semibold">
                            {submission.firstName} {submission.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Email</p>
                          <p className="text-sm">{submission.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Location</p>
                          <p className="text-sm">{submission.location}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Segments</p>
                          <div className="flex gap-1 flex-wrap">
                            {submission.segments.map((segment) => (
                              <span
                                key={segment}
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  segment === "artist"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-cyan-100 text-cyan-700"
                                }`}
                              >
                                {segment === "artist" ? "Artist" : "Community"}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Submitted</p>
                          <p className="text-sm">{new Date(submission.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="ml-4">
                        {expandedRows.has(submission.id) ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedRows.has(submission.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t bg-gray-50"
                    >
                      <div className="p-6 space-y-6">
                        {/* Contact Details */}
                        <div>
                          <h3 className="font-semibold text-lg mb-3 text-[var(--kyozo-primary)]">
                            Contact Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Phone:</span>{" "}
                              <span className="font-medium">{submission.phone || "Not provided"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Role Types */}
                        <div>
                          <h3 className="font-semibold text-lg mb-3 text-[var(--kyozo-primary)]">
                            Role Types
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {submission.roleTypes.map((role) => (
                              <span
                                key={role}
                                className="px-3 py-1 bg-white border rounded-full text-sm"
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Creative Work */}
                        <div>
                          <h3 className="font-semibold text-lg mb-3 text-[var(--kyozo-primary)]">
                            Creative Work Description
                          </h3>
                          <p className="text-sm bg-white p-4 rounded-lg border leading-relaxed">
                            {submission.creativeWork}
                          </p>
                        </div>

                        {/* Artist Questions */}
                        {submission.segments.includes("artist") && (
                          <div>
                            <h3 className="font-semibold text-lg mb-3 text-[var(--kyozo-secondary)]">
                              Artist / Creative Questions
                            </h3>
                            <div className="space-y-3 bg-white p-4 rounded-lg border">
                              <div className="grid grid-cols-[1fr,auto] gap-4 items-start text-sm">
                                <p className="text-muted-foreground font-medium">
                                  I want to grow my audience and monetise more authentically.
                                </p>
                                <span className="font-semibold text-[var(--kyozo-secondary)]">
                                  {getAgreementLabel(submission.artistQuestions.q1)}
                                </span>
                              </div>
                              <div className="grid grid-cols-[1fr,auto] gap-4 items-start text-sm border-t pt-3">
                                <p className="text-muted-foreground font-medium">
                                  Platforms force me to chase algorithms instead of focusing on my creative work.
                                </p>
                                <span className="font-semibold text-[var(--kyozo-secondary)]">
                                  {getAgreementLabel(submission.artistQuestions.q2)}
                                </span>
                              </div>
                              <div className="grid grid-cols-[1fr,auto] gap-4 items-start text-sm border-t pt-3">
                                <p className="text-muted-foreground font-medium">
                                  Social media is the only viable way to promote my work.
                                </p>
                                <span className="font-semibold text-[var(--kyozo-secondary)]">
                                  {getAgreementLabel(submission.artistQuestions.q3)}
                                </span>
                              </div>
                              <div className="grid grid-cols-[1fr,auto] gap-4 items-start text-sm border-t pt-3">
                                <p className="text-muted-foreground font-medium">
                                  I feel anxiety about posting on social media.
                                </p>
                                <span className="font-semibold text-[var(--kyozo-secondary)]">
                                  {getAgreementLabel(submission.artistQuestions.q4)}
                                </span>
                              </div>
                              <div className="grid grid-cols-[1fr,auto] gap-4 items-start text-sm border-t pt-3">
                                <p className="text-muted-foreground font-medium">
                                  I would pay for a platform offering safer sharing, deeper connections, and monetisation control.
                                </p>
                                <span className="font-semibold text-[var(--kyozo-secondary)]">
                                  {getAgreementLabel(submission.artistQuestions.q5)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Community Leader Questions */}
                        {submission.segments.includes("community") && (
                          <div>
                            <h3 className="font-semibold text-lg mb-3 text-[var(--kyozo-teal)]">
                              Community Leader Questions
                            </h3>
                            <div className="space-y-3 bg-white p-4 rounded-lg border">
                              <div className="grid grid-cols-[1fr,auto] gap-4 items-start text-sm">
                                <p className="text-muted-foreground font-medium">
                                  Managing my community across disconnected tools feels unmanageable.
                                </p>
                                <span className="font-semibold text-[var(--kyozo-teal)]">
                                  {getAgreementLabel(submission.communityQuestions.q1)}
                                </span>
                              </div>
                              <div className="grid grid-cols-[1fr,auto] gap-4 items-start text-sm border-t pt-3">
                                <p className="text-muted-foreground font-medium">
                                  Community management contributes directly to my stress and burnout.
                                </p>
                                <span className="font-semibold text-[var(--kyozo-teal)]">
                                  {getAgreementLabel(submission.communityQuestions.q2)}
                                </span>
                              </div>
                              <div className="grid grid-cols-[1fr,auto] gap-4 items-start text-sm border-t pt-3">
                                <p className="text-muted-foreground font-medium">
                                  I lack a clear view of who my members are and their engagement levels.
                                </p>
                                <span className="font-semibold text-[var(--kyozo-teal)]">
                                  {getAgreementLabel(submission.communityQuestions.q3)}
                                </span>
                              </div>
                              <div className="grid grid-cols-[1fr,auto] gap-4 items-start text-sm border-t pt-3">
                                <p className="text-muted-foreground font-medium">
                                  I would adopt a unified platform with integrated tools within 12 months.
                                </p>
                                <span className="font-semibold text-[var(--kyozo-teal)]">
                                  {getAgreementLabel(submission.communityQuestions.q4)}
                                </span>
                              </div>
                              <div className="grid grid-cols-[1fr,auto] gap-4 items-start text-sm border-t pt-3">
                                <p className="text-muted-foreground font-medium">
                                  I would pay for a platform that reduces tools, improves insights, and frees my time.
                                </p>
                                <span className="font-semibold text-[var(--kyozo-teal)]">
                                  {getAgreementLabel(submission.communityQuestions.q5)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Product Feedback Survey */}
                        <div>
                          <h3 className="font-semibold text-lg mb-3 text-[var(--kyozo-primary)]">
                            Product Feedback Survey
                          </h3>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Response:</span>{" "}
                            <span className={`font-semibold ${
                              submission.productFeedbackSurvey === "yes" 
                                ? "text-green-600" 
                                : "text-gray-600"
                            }`}>
                              {submission.productFeedbackSurvey === "yes" ? "Yes, interested" : "No, thank you"}
                            </span>
                          </p>
                        </div>

                        {/* Resonance Level */}
                        <div>
                          <h3 className="font-semibold text-lg mb-3 text-[var(--kyozo-primary)]">
                            Resonance Level
                          </h3>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Level:</span>{" "}
                            <span className={`font-semibold ${
                              submission.resonanceLevel === "high" 
                                ? "text-green-600" 
                                : "text-gray-600"
                            }`}>
                              {getResonanceLevelLabel(submission.resonanceLevel)}
                            </span>
                          </p>
                        </div>

                        {/* Resonance Reasons */}
                        {submission.resonanceReasons.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-lg mb-3 text-[var(--kyozo-primary)]">
                              Resonance Reasons
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {submission.resonanceReasons.map((reason) => (
                                <span
                                  key={reason}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                    reason === "community"
                                      ? "bg-[var(--kyozo-teal)] text-white"
                                      : "bg-[var(--kyozo-secondary)] text-white"
                                  }`}
                                >
                                  {getResonanceReasonLabel(reason)}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Beta Communities */}
                        {submission.communitySelections.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-lg mb-3 text-[var(--kyozo-primary)]">
                              Beta Community Selections
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {submission.communitySelections.map((community) => (
                                <span
                                  key={community}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                    community === "asia"
                                      ? "bg-[var(--kyozo-teal)] text-white"
                                      : "bg-[var(--kyozo-secondary)] text-white"
                                  }`}
                                >
                                  {community === "asia" ? "Creative-Entrepreneurs : Asia" : "Willer"}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}