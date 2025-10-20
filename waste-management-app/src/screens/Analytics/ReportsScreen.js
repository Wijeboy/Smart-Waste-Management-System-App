import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { colors } from '../../constants/colors';
import { dimensions } from '../../constants/dimensions';
import { mockAnalyticsData, reportTemplates } from '../../utils/mockData';

const ReportsScreen = ({ navigation }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const { financialData, customerFeedback, environmentalImpact } = mockAnalyticsData;

  const renderReportItem = ({ item }) => (
    <TouchableOpacity
      style={styles.reportItem}
      onPress={() => setSelectedReport(item)}
    >
      <View style={styles.reportHeader}>
        <Text style={styles.reportName}>{item.name}</Text>
        <Text style={styles.reportFrequency}>{item.frequency}</Text>
      </View>
      <Text style={styles.reportDescription}>{item.description}</Text>
      <View style={styles.reportType}>
        <Text style={styles.reportTypeText}>{item.type}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFinancialReport = () => (
    <View style={styles.reportContent}>
      <Text style={styles.reportTitle}>Financial Summary</Text>
      
      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Monthly Revenue</Text>
        <Text style={styles.metricValue}>${financialData.monthlyRevenue.toLocaleString()}</Text>
      </View>
      
      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Operational Costs</Text>
        <Text style={styles.metricValue}>${financialData.operationalCosts.toLocaleString()}</Text>
      </View>
      
      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Profit Margin</Text>
        <Text style={styles.metricValue}>{financialData.profitMargin}%</Text>
      </View>
      
      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Cost per Collection</Text>
        <Text style={styles.metricValue}>${financialData.costPerCollection}</Text>
      </View>

      <Text style={styles.subsectionTitle}>Revenue by Service</Text>
      {financialData.revenueByService.map((service, index) => (
        <View key={index} style={styles.serviceRow}>
          <Text style={styles.serviceName}>{service.service}</Text>
          <View style={styles.serviceDetails}>
            <Text style={styles.serviceRevenue}>${service.revenue.toLocaleString()}</Text>
            <Text style={styles.servicePercentage}>{service.percentage}%</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderCustomerReport = () => (
    <View style={styles.reportContent}>
      <Text style={styles.reportTitle}>Customer Satisfaction Report</Text>
      
      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Total Responses</Text>
        <Text style={styles.metricValue}>{customerFeedback.totalResponses}</Text>
      </View>
      
      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Average Rating</Text>
        <Text style={styles.metricValue}>{customerFeedback.averageRating}/5</Text>
      </View>

      <Text style={styles.subsectionTitle}>Rating Distribution</Text>
      {customerFeedback.distribution.map((rating, index) => (
        <View key={index} style={styles.ratingRow}>
          <Text style={styles.ratingStars}>{'⭐'.repeat(rating.rating)}</Text>
          <Text style={styles.ratingCount}>{rating.count} responses</Text>
          <Text style={styles.ratingPercentage}>{rating.percentage}%</Text>
        </View>
      ))}

      <Text style={styles.subsectionTitle}>Common Issues</Text>
      {customerFeedback.commonIssues.map((issue, index) => (
        <View key={index} style={styles.issueRow}>
          <Text style={styles.issueName}>{issue.issue}</Text>
          <Text style={styles.issueCount}>{issue.count} reports</Text>
        </View>
      ))}
    </View>
  );

  const renderEnvironmentalReport = () => (
    <View style={styles.reportContent}>
      <Text style={styles.reportTitle}>Environmental Impact Report</Text>
      
      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>CO₂ Reduced</Text>
        <Text style={styles.metricValue}>{environmentalImpact.co2Reduced} kg</Text>
      </View>
      
      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Energy Saved</Text>
        <Text style={styles.metricValue}>{environmentalImpact.energySaved} kWh</Text>
      </View>
      
      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Landfill Diverted</Text>
        <Text style={styles.metricValue}>{environmentalImpact.landfillDiverted} kg</Text>
      </View>
      
      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Recycling Achieved</Text>
        <Text style={styles.metricValue}>{environmentalImpact.recyclingAchieved} kg</Text>
      </View>
    </View>
  );

  const renderReportContent = () => {
    if (!selectedReport) return null;
    
    switch (selectedReport.type) {
      case 'financial':
        return renderFinancialReport();
      case 'customer':
        return renderCustomerReport();
      case 'environmental':
        return renderEnvironmentalReport();
      default:
        return (
          <View style={styles.reportContent}>
            <Text style={styles.reportTitle}>{selectedReport.name}</Text>
            <Text style={styles.reportDescription}>{selectedReport.description}</Text>
            <Text style={styles.comingSoon}>Report content coming soon...</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reports</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.reportsList}>
          <Text style={styles.sectionTitle}>Available Reports</Text>
          <FlatList
            data={reportTemplates}
            renderItem={renderReportItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {selectedReport && (
          <View style={styles.reportViewer}>
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {renderReportContent()}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: colors.primary,
    padding: dimensions.padding,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    color: colors.surface,
    fontSize: 16,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.surface,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  reportsList: {
    flex: 1,
    padding: dimensions.padding,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  reportItem: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: dimensions.borderRadius,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  reportFrequency: {
    fontSize: 12,
    color: colors.textSecondary,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  reportType: {
    alignSelf: 'flex-start',
  },
  reportTypeText: {
    fontSize: 12,
    color: colors.primary,
    backgroundColor: colors.primaryLight + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  reportViewer: {
    flex: 2,
    padding: dimensions.padding,
  },
  reportContent: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: dimensions.borderRadius,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  metricLabel: {
    fontSize: 16,
    color: colors.text,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
    marginBottom: 12,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  serviceName: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  serviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceRevenue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 12,
  },
  servicePercentage: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  ratingStars: {
    fontSize: 16,
    marginRight: 12,
  },
  ratingCount: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  ratingPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  issueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  issueName: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  issueCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  comingSoon: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export default ReportsScreen;
